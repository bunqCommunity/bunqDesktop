let exportObject;

if (process.env.JEST) {
    exportObject = require("os");
} else {
    exportObject = require("electron").remote.require("os");
}

export default exportObject;
