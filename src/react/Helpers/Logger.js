// load the electron-log instance so we can write to the filesystem
const remote = require("electron").remote;
const electronLog = remote ? remote.require("electron-log") : require("electron-log");

export default {
    log: (...params) => {
        console.log(...params);
        electronLog.log(...params);
    },
    error: (...params) => {
        console.error(...params);
        electronLog.error(...params);
    },
    warn: (...params) => {
        console.warn(...params);
        electronLog.warn(...params);
    },
    info: (...params) => {
        console.info(...params);
        electronLog.info(...params);
    },
    verbose: (...params) => {
        console.debug(...params);
        electronLog.verbose(...params);
    },
    debug: (...params) => {
        console.debug(...params);
        electronLog.debug(...params);
    },
    silly: (...params) => {
        console.debug(...params);
        electronLog.silly(...params);
    }
};
