// trigger a log event within the main electorn process
const { remote } = window.require("electron");
const log = remote.require("electron-log");

module.exports = log;
