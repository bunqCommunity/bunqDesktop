import { ipcMain, TouchBar } from "electron";
import changePage from "./react_navigate";

const { TouchBarButton } = TouchBar;

export default (window, i18n) => {
    const dashboardButton = new TouchBarButton({
        label: "🏠 " + i18n.t("Dashboard"),
        click: () => {
            changePage(window, "/");
        }
    });

    const payButton = new TouchBarButton({
        label: "👆 " + i18n.t("Pay"),
        click: () => {
            changePage(window, "/pay");
        }
    });

    const requestButton = new TouchBarButton({
        label: "👇 " + i18n.t("Request"),
        click: () => {
            changePage(window, "/request");
        }
    });

    const bunqMeButton = new TouchBarButton({
        label: "💰 " + i18n.t("bunqme"),
        click: () => {
            changePage(window, "/bunqme-tab");
        }
    });

    const cardsButton = new TouchBarButton({
        label: "💳 " + i18n.t("Cards"),
        click: () => {
            changePage(window, "/card");
        }
    });

    // listen for changes in language in the client
    ipcMain.on("change-language", (event, arg) => {
        i18n.changeLanguage(arg);
        // update labels to new language

        dashboardButton.label = "🏠 " + i18n.t("Dashboard");
        payButton.label = "👆 " + i18n.t("Pay");
        requestButton.label = "👇 " + i18n.t("Request");
        bunqMeButton.label = "💰 " + i18n.t("bunqme");
        cardsButton.label = "💳 " + i18n.t("Cards");
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
