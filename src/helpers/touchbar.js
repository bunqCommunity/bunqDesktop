import { TouchBar } from "electron";
import changePage from "./react_navigate";

const { TouchBarButton } = TouchBar;

export default window => {
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
        label: "💰 bunq.me",
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

    const bar = new TouchBar([
        dashboardButton,
        payButton,
        requestButton,
        bunqMeButton,
        cardsButton
    ]);

    window.setTouchBar(bar);
};
