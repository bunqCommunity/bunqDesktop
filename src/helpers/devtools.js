export default async () => {
    const installExtension = require("electron-devtools-installer");
    const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = installExtension;

    await Promise.all([installExtension.default(REACT_DEVELOPER_TOOLS), installExtension.default(REDUX_DEVTOOLS)]);
};
