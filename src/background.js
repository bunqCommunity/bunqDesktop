import path from "path";
import url from "url";
import log from "electron-log";
import settings from "electron-settings";
import { app, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";
import registerShortcuts from "./helpers/shortcuts";
import registerTouchBar from './helpers/touchbar';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "./env";

const setApplicationMenu = () => {
    const menus = [
        editMenuTemplate
    ];
    if (env.name === "development") {
        menus.push(devMenuTemplate);
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
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

    const mainWindow = createWindow("main", {
        frame: USE_NATIVE_FRAME,
        webPreferences: { webSecurity: false },
        width: 1000,
        height: 800
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "app.html"),
            protocol: "file:",
            slashes: true
        })
    );

    registerShortcuts(mainWindow, app);
    registerTouchBar(mainWindow);

    if (env.name === "development") {
        mainWindow.openDevTools();
    } else {
        // remove the menu in production
        mainWindow.setMenu(null);
    }


});

app.on("window-all-closed", () => {
    app.quit();
});
