export default (window, page) => {
    if (!window.isVisible()) window.show();
    window.webContents.send("change-path", page);
    window.focus();
};
