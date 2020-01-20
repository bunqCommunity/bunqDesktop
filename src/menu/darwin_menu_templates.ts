import { app } from "electron";

export default menus => {
    if (process.platform === "darwin") {
        menus.unshift({
            label: app.getName(),
            submenu: [
                { role: "about" },
                { type: "separator" },
                { role: "services", submenu: [] },
                { type: "separator" },
                { role: "hide" },
                { role: "hideothers" },
                { role: "unhide" },
                { type: "separator" },
                { role: "quit" }
            ]
        });

        // Edit menu
        menus[1].submenu.push(
            { type: "separator" },
            {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }]
            }
        );

        // Window menu
        menus[3].submenu = [
            { role: "close" },
            { role: "minimize" },
            { role: "zoom" },
            { type: "separator" },
            { role: "front" }
        ];
    }

    return menus;
};
