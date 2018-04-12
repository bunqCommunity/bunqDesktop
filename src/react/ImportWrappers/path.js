let exportObject;

if (process.env.JEST) {
    exportObject = require("path");
} else {
    exportObject = require("electron").remote.require("path");
}

export default exportObject;
