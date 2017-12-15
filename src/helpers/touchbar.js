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
        label: '💰 bunq.me',
        click: () => {
            window.webContents.send('change-path', '/bunqme-tab')
        }
    });

    const cardsButton = new TouchBarButton({
        label: '💳 Cards',
        click: () => {
            window.webContents.send('change-path', '/card')
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
}