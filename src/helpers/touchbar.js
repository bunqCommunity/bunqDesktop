import { ipcMain, TouchBar } from "electron";
import changePage from "./react_navigate";

const { TouchBarButton } = TouchBar;

export default (window, i18n) => {
    const dashboardButton = new TouchBarButton({
        // label: "🏠 " + i18n.t("Dashboard"),
        label: "🏠 Dashboard",
        click: () => {
            changePage(window, "/");
        }
    });

    const payButton = new TouchBarButton({
        // label: "👆 " + i18n.t("Pay"),
        label: "👆 Pay",
        click: () => {
            changePage(window, "/pay");
        }
    });

    const requestButton = new TouchBarButton({
        // label: "👇 " + i18n.t("Request"),
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
        // label: "💳 " + i18n.t("Cards"),
        label: "💳 Cards",
        click: () => {
            changePage(window, "/card");
        }
    });

    const bar = new TouchBar([
        dashboardButton,
        payButton,
        requestButton,
        bunqMeButton,
        cardsButton
    ]);

    window.setTouchBar(bar);
};
