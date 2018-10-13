import { app, ipcMain, Menu, MenuItem, Tray } from "electron";
import changePage from "./react_navigate";

let loggedInText = "Not logged in";
let balanceLabel = "Balance: $2000.21";
let balanceVisible = false;
let accountLabels = [];
let accountsVisible = false;

export default (mainWindow, trayIcon) => {
    const tray = new Tray(trayIcon);

    const updateTrayMenu = () => {
        const loggedInMenuItem = new MenuItem({
            label: loggedInText
        });
        const totalBalanceMenuItem = new MenuItem({
            label: balanceLabel,
            visible: balanceVisible
        });
        const accountsMenuItem = new MenuItem({
            label: "Accounts",
            visible: accountsVisible,
            submenu: accountLabels
        });

        const menuItems = [
            loggedInMenuItem,
            totalBalanceMenuItem,
            accountsMenuItem,
            { type: "separator" },
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
        ];

        const contextMenu = Menu.buildFromTemplate(menuItems);

        tray.setContextMenu(contextMenu);
        tray.setToolTip("bunqDesktop");
    };

    ipcMain.on("set-tray-loggedin", (event, loggedinText) => {
        if (!loggedinText) {
            loggedInText = "Not logged in";
        } else {
            loggedInText = loggedinText;
        }
        updateTrayMenu();
    });
    ipcMain.on("set-tray-accounts", (event, accounts) => {
        if (!accounts) {
            accountsVisible = false;
            accountLabels = [];
        } else {
            accountsVisible = true;
            accountLabels = accounts.map(account => {
                return {
                    label: `${account.description}: ${account.balance}`
                };
            });
        }
        updateTrayMenu();
    });
    ipcMain.on("set-tray-balance", (event, totalBalance) => {
        if (!totalBalance) {
            balanceVisible = false;
            balanceLabel = "";
        } else {
            balanceVisible = true;
            balanceLabel = `Balance: ${totalBalance}`;
        }
        updateTrayMenu();
    });

    updateTrayMenu();

    tray.on("click", () => {
        // show app on single click
        mainWindow.show();
    });
};
