import { ipcRenderer } from "electron";

export default (title, content, options = {}) => {
    if (process.platform === "win32") {
        // on windows use the display balloon
        const notificationOptions = {
            title: title,
            content: content,
            ...options
        };
        ipcRenderer.send("display-balloon", notificationOptions);
    } else {
        // on all other platforms use te native notifcations
        const nativeOptions = {
            body: content,
            ...options
        };
        return new Notification(title, nativeOptions);
    }
};
