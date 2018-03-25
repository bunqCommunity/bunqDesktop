import path from "path";
import url from "url";
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

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "./env";

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

// Save userData in separate folders for each environment
if (env.name !== "production") {
    const userDataPath = app.getPath("userData");
    app.setPath("userData", `${userDataPath} (${env.name})`);
}

// setup the logger
log.transports.file.appName = "BunqDesktop";
log.transports.file.level = env.name === "development" ? "debug" : "warn";
log.transports.file.format = "{h}:{i}:{s}:{ms} {text}";
log.transports.file.file = `${app.getPath("userData")}/BunqDesktop.log.txt`;

app.on("ready", () => {
    setApplicationMenu();

    // set the correct path
    settings.setPath(`${app.getPath("userData")}/settings.json`);

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
        path.join(__dirname, "../app/images/32x32.png")
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
    }

    mainWindow.on("minimize", function(event) {
        const minimizeToTray = !!settings.get("MINIMIZE_TO_TRAY");
        if (minimizeToTray) {
            createTrayIcon();
            event.preventDefault();
            mainWindow.hide();
        }
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
