import path from "path";
import url from "url";
import { app, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";
import registerShortcuts from "./helpers/shortcuts"

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "./env";

const setApplicationMenu = () => {
    const menus = [];
    if (env.name === "development") {
        menus.push(editMenuTemplate);
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

app.on("ready", () => {
    setApplicationMenu();

    const mainWindow = createWindow("main", {
        frame: true,
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
