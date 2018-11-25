// load the electron-log instance so we can write to the filesystem
const remote = require("electron").remote;
export default (remote ? remote.require("electron-log") : require("electron-log"));
