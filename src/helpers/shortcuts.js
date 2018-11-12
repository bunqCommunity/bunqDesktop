import localShortcuts from "electron-localshortcut";
import changePage from "./react_navigate";

export default (window, app) => {
    localShortcuts.register(window, "CmdOrCtrl+Q", () => {
        app.quit();
    });

    localShortcuts.register(window, "CmdOrCtrl+H", () => {
        window.webContents.send("toggle-balance");
    });
    localShortcuts.register(window, "CmdOrCtrl+T", () => {
        window.webContents.send("toggle-theme");
    });
    localShortcuts.register(window, "CmdOrCtrl+U", () => {
        window.webContents.send("trigger-queue-sync");
    });
    localShortcuts.register(window, "F5", () => {
        window.reload();
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
        changePage(window, "/cards");
    });
    localShortcuts.register(window, "Alt+S", () => {
        changePage(window, "/settings");
    });
};
