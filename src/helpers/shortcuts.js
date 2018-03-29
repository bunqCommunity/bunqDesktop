import changePage from "./react_navigate";
import localShortcuts from "electron-localshortcut";

export default (window, app) => {
    localShortcuts.register(window, "CmdOrCtrl+Q", () => {
        app.quit();
    });

    localShortcuts.register(window, "CmdOrCtrl+H", () => {
        window.hide();
    });

    localShortcuts.register(window, "CmdOrCtrl+D", () => {
        changePage(window, "/")
    });
    localShortcuts.register(window, "CmdOrCtrl+P", () => {
        changePage(window, "/pay")
    });
    localShortcuts.register(window, "CmdOrCtrl+R", () => {
        changePage(window, "/request")
    });
    localShortcuts.register(window, "Alt+C", () => {
        changePage(window, "/card")
    });
};
