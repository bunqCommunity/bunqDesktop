import url from "url";
import path from "path";
import log from "electron-log";
import electron from "electron";
import settings from "electron-settings";
import { app, Menu, Tray, nativeImage, ipcMain, BrowserWindow } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";
import registerShortcuts from "./helpers/shortcuts";
import registerTouchBar from "./helpers/touchbar";
import changePage from "./helpers/react_navigate";
import settingsHelper from "./helpers/settings";
import oauth from "./helpers/oauth";

// import i18n from "./i18n-background";
import env from "./env";

// disable security warnings since we need cross-origin requests
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 1;

// // use english by default
// i18n.changeLanguage("en");
//
// // listen for changes in language in the client
// ipcMain.on("change-language", (event, arg) => {
//     i18n.changeLanguage(arg);
// });

// listen for changes in settings path
ipcMain.on("change-settings-path", (event, newPath) => {
    settingsHelper.savePath(newPath);
});

const userDataPath = app.getPath("userData");

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
    app.setPath("userData", `${userDataPath} (${env.name})`);
}

// setup the logger
log.transports.file.appName = "BunqDesktop";
log.transports.file.level = "debug";
log.transports.file.maxSize = 512 * 1024;
log.transports.file.format = "{h}:{i}:{s}:{ms} {text}";
log.transports.file.file = `${userDataPath}${path.sep}BunqDesktop.${env.name}.log.txt`;

// hot reloading
if (process.env.NODE_ENV === "development") {
    require("electron-reload")(
        path.join(__dirname, `..${path.sep}app${path.sep}**`)
    );
}

// set the correct path before the app loads
settings.setPath(settingsHelper.loadPath());

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
    registerTouchBar(mainWindow, null);

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
                // label: i18n.t("Dashboard"),
                label: "Dashboard",
                click: () => changePage(mainWindow, "/")
            },
            {
                // label: i18n.t("Pay"),
                label: "Pay",
                click: () => changePage(mainWindow, "/pay")
            },
            {
                // label: i18n.t("Request"),
                label: "Request",
                click: () => changePage(mainWindow, "/request")
            },
            {
                // label: i18n.t("Cards"),
                label: "Cards",
                click: () => changePage(mainWindow, "/card")
            },
            { type: "separator" },
            {
                // label: i18n.t("Quit"),
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

    // handle minimize event to minimze to tray when requried
    mainWindow.on("minimize", function(event) {
        const minimizeToTray = !!settings.get("MINIMIZE_TO_TRAY");
        if (minimizeToTray) {
            createTrayIcon();
            event.preventDefault();
            mainWindow.hide();
        }
    });

    // handle app command events like mouse-back/mouse-forward
    mainWindow.on("app-command", function(e, cmd) {
        switch (cmd) {
            case "browser-backward":
                mainWindow.webContents.send("history-backward");
                break;
            case "browser-forward":
                mainWindow.webContents.send("history-forward");
                break;
        }
    });

    // if the mainwindow closes, all windows should close
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

    // register oauth handlers
    oauth(mainWindow);
});

app.on("window-all-closed", () => {
    app.quit();
});
