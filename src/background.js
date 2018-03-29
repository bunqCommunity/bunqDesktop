import fs from "fs";
import url from "url";
import path from "path";
import log from "electron-log";
import electron from "electron";
import settings from "electron-settings";
import { app, Menu, Tray, nativeImage } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";
import registerShortcuts from "./helpers/shortcuts";
import registerTouchBar from "./helpers/touchbar";
import changePage from "./helpers/react_navigate";
import defaultConfig from "./helpers/default_config";

import env from "./env";

const userDataPath = app.getPath("userData");
const SETTINGS_LOCATION_FILE = path.normalize(
    `${userDataPath}${path.sep}..${path.sep}BunqDesktop${path.sep}${path.sep}SETTINGS_LOCATION`
);
const DEFAULT_SETTINGS_LOCATION = `${userDataPath}${path.sep}settings.json`;

// hide/show different native menus based on env
const setApplicationMenu = () => {
    const menus = [editMenuTemplate];
    if (env.name === "development") {
        menus.push(devMenuTemplate);
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// returns an url formatted file location
const getWindowUrl = fileName => {
    return url.format({
        pathname: path.join(__dirname, fileName),
        protocol: "file:",
        slashes: true
    });
};

// stores the file location of our settings file
const getSettingsLocation = () => {
    // check if the parent folder exists
    if (fs.existsSync(path.dirname(SETTINGS_LOCATION_FILE))) {
        try {
            // check if the settings lock file exists
            if (!fs.existsSync(SETTINGS_LOCATION_FILE)) {
                // create a default file
                fs.writeFileSync(
                    SETTINGS_LOCATION_FILE,
                    DEFAULT_SETTINGS_LOCATION
                );
            }
            // return the lock file contents
            return fs.readFileSync(SETTINGS_LOCATION_FILE).toString();
        } catch (ex) {}
    }

    // create the settings lock file
    fs.writeFileSync(SETTINGS_LOCATION_FILE, DEFAULT_SETTINGS_LOCATION);

    // check if the default settings file exists
    if (!fs.existsSync(DEFAULT_SETTINGS_LOCATION)) {
        // fill the settings file with our default config
        fs.writeFileSync(
            DEFAULT_SETTINGS_LOCATION,
            JSON.stringify(defaultConfig())
        );
    }

    return DEFAULT_SETTINGS_LOCATION;
};

// Save userData in separate folders for each environment
if (env.name !== "production") {
    app.setPath("userData", `${userDataPath} (${env.name})`);
}

// setup the logger
log.transports.file.appName = "BunqDesktop";
log.transports.file.level = env.name === "development" ? "debug" : "warn";
log.transports.file.format = "{h}:{i}:{s}:{ms} {text}";
log.transports.file.file = `${userDataPath}${path.sep}BunqDesktop.${env.name}.log.txt`;

// hot reloading
if (process.env.NODE_ENV === "DEVELOPMENT") {
    require("electron-reload")(
        path.join(__dirname, `..${path.sep}app${path.sep}**`)
    );
}

// set the correct path before the app loads
settings.setPath(getSettingsLocation());

app.on("ready", () => {
    setApplicationMenu();

    const USE_NATIVE_FRAME_STORED = settings.get("USE_NATIVE_FRAME");
    const USE_NATIVE_FRAME =
        USE_NATIVE_FRAME_STORED !== undefined &&
        USE_NATIVE_FRAME_STORED === true;

    // setup the main window
    const mainWindow = createWindow("main", {
        frame: USE_NATIVE_FRAME,
        webPreferences: { webSecurity: false },
        width: 1000,
        height: 800
    });

    // load the app.html file to get started
    mainWindow.loadURL(getWindowUrl("app.html"));

    registerShortcuts(mainWindow, app);
    registerTouchBar(mainWindow);

    if (env.name === "development") {
        mainWindow.openDevTools();
    }

    const trayIcon = nativeImage.createFromPath(
        path.join(
            __dirname,
            `..${path.sep}app${path.sep}images${path.sep}32x32.png`
        )
    );

    const createTrayIcon = () => {
        // setup the tray handler
        const tray = new Tray(trayIcon);
        const contextMenu = Menu.buildFromTemplate([
            {
                label: "Dashboard",
                click: () => changePage(mainWindow, "/")
            },
            {
                label: "Pay",
                click: () => changePage(mainWindow, "/pay")
            },
            {
                label: "Request",
                click: () => changePage(mainWindow, "/request")
            },
            {
                label: "Cards",
                click: () => changePage(mainWindow, "/card")
            },
            { type: "separator" },
            {
                label: "Quit",
                click: () => app.quit()
            }
        ]);
        tray.setContextMenu(contextMenu);
        tray.setToolTip("BunqDesktop");

        // Event handlers
        tray.on("click", () => {
            // show app on single click
            if (!mainWindow.isVisible()) mainWindow.show();
            tray.destroy();
        });
    };

    mainWindow.on("minimize", function(event) {
        const minimizeToTray = !!settings.get("MINIMIZE_TO_TRAY");
        if (minimizeToTray) {
            createTrayIcon();
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on("close", function(event) {
        app.quit();
    });

    // reload the window if the system goes into sleep mode
    electron.powerMonitor.on("resume", () => {
        log.debug("resume");
        mainWindow.reload();
    });
    electron.powerMonitor.on("suspend", () => {
        log.debug("suspend");
    });
});

app.on("window-all-closed", () => {
    app.quit();
});
