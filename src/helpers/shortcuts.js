import { globalShortcut } from 'electron'


export default (app) => {
    globalShortcut.register('Command+Q', () => {
        app.quit();
    })
}