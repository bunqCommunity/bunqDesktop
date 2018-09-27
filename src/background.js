import fs from "fs";
import url from "url";
import path from "path";
import log from "electron-log";
import electron from "electron";
import settings from "electron-settings";
import { app, Menu, Tray, nativeImage, ipcMain, BrowserWindow } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import { helpMenuTemplate } from "./menu/help_menu_template";
import { viewMenuTemplate } from "./menu/view_menu_template";
import { windowMenuTemplate } from "./menu/window_menu_template";
import darwinMenuTemplates from "./menu/darwin_menu_templates";
import createWindow from "./helpers/window";
import registerShortcuts from "./helpers/shortcuts";
import registerTouchBar from "./helpers/touchbar";
import changePage from "./helpers/react_navigate";
import settingsHelper from "./helpers/settings";
import oauth from "./helpers/oauth";

import sentry from "./sentry";

// import the following to deal with pdf
const ipc = electron.ipcMain;
const shell = electron.shell;

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
    let menus = [
        editMenuTemplate,
        viewMenuTemplate,
        windowMenuTemplate,
        helpMenuTemplate
    ];

    // modify templates if on darwin
    menus = darwinMenuTemplates(menus);

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
log.transports.file.file = `${userDataPath}${path.sep}BunqDesktop.${
    env.name
}.log.txt`;

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
        webPreferences: { webSecurity: false, nodeIntegration: true },
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

    // setup the tray handler
    const trayIcon = nativeImage.createFromPath(
        path.join(
            __dirname,
            `..${path.sep}app${path.sep}images${path.sep}32x32.png`
        )
    );
    const notificationIcon = nativeImage.createFromPath(
        path.join(
            __dirname,
            `..${path.sep}app${path.sep}images${path.sep}256x256.png`
        )
    );
    const tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Dashboard",
            click: () => changePage(mainWindow, "/")
        },
        {
            label: "Update",
            click: () => mainWindow.webContents.send("trigger-queue-sync")
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
    tray.setToolTip("bunqDesktop");

    // Event handlers
    tray.on("click", () => {
        // show app on single click
        if (!mainWindow.isVisible()) mainWindow.show();
    });

    // handle minimize event to minimze to tray when requried
    mainWindow.on("minimize", function(event) {
        const minimizeToTray = !!settings.get("MINIMIZE_TO_TRAY");
        if (minimizeToTray) {
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
    oauth(mainWindow, log);

    // handler to display a balloon message for windows
    ipc.on("display-balloon", (event, data) => {
        tray.displayBalloon({
            icon: notificationIcon,
            title: data.title,
            content: data.content
        });
    });

    // event handler to create pdf from the active window
    ipc.on("print-to-pdf", (event, fileName) => {
        // get download directory
        const downloadDir = app.getPath("downloads");

        // create the absolute path for the pdf file
        const pdfPath = path.join(downloadDir, fileName);

        // get the window instance, this lets the pdf download get triggered from other windows
        const win = BrowserWindow.fromWebContents(event.sender);

        // run the toPdf function and retrieve the data
        win.webContents.printToPDF(
            {
                printBackground: true,
                pageSize: "A4",
                printSelectionOnly: false,
                landscape: false
            },
            (error, data) => {
                if (error) return log.error(error.message);

                fs.writeFile(pdfPath, data, error => {
                    if (error) return log.error(error.message);

                    // attempt to open the file
                    try {
                        shell.openExternal("file://" + pdfPath);
                    } catch (err) {
                        if (error) return log.error(error.message);
                    }

                    // send a event to tell the user the pdf was written
                    event.sender.send("wrote-pdf", pdfPath);
                });
            }
        );
    });
});

app.on("window-all-closed", () => {
    app.quit();
});
