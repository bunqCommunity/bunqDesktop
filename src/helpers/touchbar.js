import { ipcMain, TouchBar } from "electron";
import changePage from "./react_navigate";

const { TouchBarButton } = TouchBar;

export default (window, i18n) => {
    const dashboardButton = new TouchBarButton({
        label: "🏠 Dashboard",
        click: () => {
            changePage(window, "/");
        }
    });

    const payButton = new TouchBarButton({
        label: "👆 Pay",
        click: () => {
            changePage(window, "/pay");
        }
    });

    const requestButton = new TouchBarButton({
        label: "👇 Request",
        click: () => {
            changePage(window, "/request");
        }
    });

    const bunqMeButton = new TouchBarButton({
        // label: "💰 " + i18n.t("bunqme"),
        label: "💰 bunqme",
        click: () => {
            changePage(window, "/bunqme-tab");
        }
    });

    const cardsButton = new TouchBarButton({
        label: "💳 Cards",
        click: () => {
            changePage(window, "/card");
        }
    });

    const updateQueueButton = new TouchBarButton({
        label: "🔄 Update",
        click: () => {
            window.webContents.send("trigger-queue-sync");
            window.focus();
        }
    });

    ipcMain.on("loaded-new-events", (event, newEventCount) => {
        updateQueueButton.label = `🔄 ${newEventCount} new events`;
    });

    const bar = new TouchBar([dashboardButton, updateQueueButton, payButton, requestButton, bunqMeButton, cardsButton]);

    window.setTouchBar(bar);
};
