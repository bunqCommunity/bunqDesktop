import localShortcuts from "electron-localshortcut";
import changePage from "./react_navigate";

export default (window, app) => {
    localShortcuts.register(window, "CmdOrCtrl+Q", () => {
        app.quit();
    });

    localShortcuts.register(window, "CmdOrCtrl+H", () => {
        window.webContents.send("toggle-balance");
    });

    localShortcuts.register(window, "CmdOrCtrl+D", () => {
        changePage(window, "/");
    });
    localShortcuts.register(window, "CmdOrCtrl+P", () => {
        changePage(window, "/pay");
    });
    localShortcuts.register(window, "CmdOrCtrl+R", () => {
        changePage(window, "/request");
    });
    localShortcuts.register(window, "Alt+C", () => {
        changePage(window, "/card");
    });
};
