const remote = require("electron").remote;
const isDarwinPlatform = remote.require("os").platform() === "darwin";

export default () => {
    return isDarwinPlatform;
};
