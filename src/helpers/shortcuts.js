import localShortcuts from 'electron-localshortcut'

export default (window, app) => {
    localShortcuts.register(window, 'Command+Q', () => {
        app.quit();
    });
}