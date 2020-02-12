import { app, shell, Menu, Tray, ipcMain, nativeImage, systemPreferences, BrowserWindow } from "electron";
import os from "os";
import fs from "fs";
import url from "url";
import path from "path";
import log from "electron-log";
import settings from "electron-settings";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import { helpMenuTemplate } from "./menu/help_menu_template";
import { viewMenuTemplate } from "./menu/view_menu_template";
import { windowMenuTemplate } from "./menu/window_menu_template";
import darwinMenuTemplates from "./menu/darwin_menu_templates";
import createWindow from "./helpers/window";
import registerShortcuts from "./helpers/shortcuts";
import registerTouchBar from "./helpers/touchbar";
import setupTrayIcon from "./helpers/tray";
import settingsHelper from "./helpers/settings";
import oauth from "./helpers/oauth";
import devTools from "./helpers/devtools";
import env from "./env";

// disable security warnings since we need cross-origin requests
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 1;

const platform = os.platform();
let userDataPath = app.getPath("userData");

const imagesDir = path.join(__dirname, `..${path.sep}app${path.sep}images${path.sep}`);
let trayIcon = "";
if (platform === "darwin") {
    trayIcon = nativeImage.createFromPath(`${imagesDir}logoTemplate@1x.png`);
    trayIcon.setTemplateImage(true);

    const iconScale2Raw = fs.readFileSync(`${imagesDir}logoTemplate@2x.png`);
    trayIcon.addRepresentation({
        scaleFactor: 2,
        width: 38,
        height: 38,
        buffer: iconScale2Raw
    });
    const iconScale3Raw = fs.readFileSync(`${imagesDir}logoTemplate@3x.png`);
    trayIcon.addRepresentation({
        scaleFactor: 3,
        width: 76,
        height: 76,
        buffer: iconScale3Raw
    });
} else {
    trayIcon = nativeImage.createFromPath(`${imagesDir}icon.ico`);
}
const notificationIcon = nativeImage.createFromPath(`${imagesDir}256x256.png`);

// hide/show different native menus based on env
const setApplicationMenu = () => {
    let menus = [editMenuTemplate, viewMenuTemplate, windowMenuTemplate, helpMenuTemplate];

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
    userDataPath = app.getPath("userData");
}

// setup the logger
log.transports.file.appName = "bunqDesktop";
log.transports.file.level = "debug";
log.transports.file.maxSize = 512 * 1024;
log.transports.file.format = "{h}:{i}:{s}:{ms} {text}";
log.transports.file.file = `${userDataPath}${path.sep}bunqDesktop.${env.name}.log.txt`;

// hot reloading
if (process.env.NODE_ENV === "development") {
    require("electron-reload")(path.join(__dirname, `..${path.sep}app${path.sep}**`), {
        electron: path.join(__dirname, "../node_modules/electron")
    });
}

// set the correct path before the app loads
settings.setPath(settingsHelper.loadPath());

app.on("ready", () => {
    setApplicationMenu();

    const USE_NATIVE_FRAME_STORED = settings.get("USE_NATIVE_FRAME");
    const USE_NATIVE_FRAME = USE_NATIVE_FRAME_STORED !== undefined && USE_NATIVE_FRAME_STORED === true;

    // setup the main window
    const mainWindow = createWindow("main", {
        frame: USE_NATIVE_FRAME,
        webPreferences: { webSecurity: false, nodeIntegration: true },
        width: 1000,
        height: 800,
        show: false
    });

    // load the app.html file to get started
    mainWindow.loadURL(getWindowUrl("app.html"));

    registerShortcuts(mainWindow, app);
    registerTouchBar(mainWindow, null);

    // setup the tray handler
    const tray = setupTrayIcon(mainWindow, trayIcon);

    // on ready, show the main window
    mainWindow.on("ready-to-show", function() {
        mainWindow.show();
        mainWindow.focus();

        if (env.name === "development") {
            // Add React dev tools
            devTools()
                .catch(console.error)
                .then(() => mainWindow.openDevTools());
        }
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

    // system preferences listen for mojave events
    if (platform === "darwin") {
        const setCorrectTheme = () => {
            // toggle back to regular theme or dark theme if apple them changed
            if (systemPreferences.isDarkMode() && settings.get("BUNQDESKTOP_THEME") !== "DarkTheme") {
                mainWindow.webContents.send("toggle-theme");
            } else if (!systemPreferences.isDarkMode() && settings.get("BUNQDESKTOP_THEME") === "DarkTheme") {
                mainWindow.webContents.send("toggle-theme");
            }
        };

        setCorrectTheme();
        systemPreferences.subscribeNotification("AppleInterfaceThemeChangedNotification", () => {
            setCorrectTheme();
        });
    }

    // register oauth handlers
    oauth(mainWindow, log);

    // listen for changes in settings path
    ipcMain.on("change-settings-path", (event, newPath) => {
        settingsHelper.savePath(newPath);
    });

    // handler to display a balloon message for windows
    ipcMain.on("display-balloon", (event, data) => {
        tray.displayBalloon({
            icon: notificationIcon,
            title: data.title,
            content: data.content
        });
    });

    // event handler to create pdf from the active window
    ipcMain.on("print-to-pdf", (event, fileName) => {
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
