export default async () => {
  const installExtension = require("electron-devtools-installer");
  const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = installExtension;

  await Promise.all([
    installExtension(REACT_DEVELOPER_TOOLS),
    installExtension(REDUX_DEVTOOLS),
  ]);
};
