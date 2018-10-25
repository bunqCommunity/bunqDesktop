export const helpMenuTemplate = {
    role: "help",
    submenu: [
        {
            label: "Learn More",
            click() {
                require("electron").shell.openExternal("https://github.com/bunqCommunity/bunqDesktop");
            }
        }
    ]
};
