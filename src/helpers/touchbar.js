import { TouchBar } from 'electron'

const { TouchBarButton } = TouchBar;

export default (window) => {

    const dashboardButton = new TouchBarButton({
        label: '🏠 Dashboard',
        click: () => {
            window.webContents.send('change-path', '/')
        }
    });

    const payButton = new TouchBarButton({
        label: '👆 Pay',
        click: () => {
            window.webContents.send('change-path', '/pay')
        }
    });

    const requestButton = new TouchBarButton({
        label: '👇 Request',
        click: () => {
            window.webContents.send('change-path', '/request')
        }
    });

    const bunqMeButton = new TouchBarButton({
        label: '💰 bunq.me requests',
        click: () => {
            window.webContents.send('change-path', '/bunqme-tab')
        }
    });

    const bar = new TouchBar([
        dashboardButton,
        payButton,
        requestButton,
        bunqMeButton
    ]);

    window.setTouchBar(bar);
}