import { TouchBar } from 'electron'

const { TouchBarButton } = TouchBar;

export default (window) => {

    const dashboardButton = new TouchBarButton({
        label: '🏠 Dashboard'
    });

    const payButton = new TouchBarButton({
        label: '👆 Pay'
    });

    const requestButton = new TouchBarButton({
        label: '👇 Request'
    });

    const bunqMeButton = new TouchBarButton({
        label: '💰 bunq.me requests'
    });

    const bar = new TouchBar([
        dashboardButton,
        payButton,
        requestButton,
        bunqMeButton
    ]);

    window.setTouchBar(bar)
}