const remote = require("electron").remote;
const platform = remote
    ? remote.require("os").platform()
    : require("os").platform();

export default () => {
    return platform === "darwin";
};
