let exportObject;

if (process.env.JEST) {
    exportObject = require("fs");
} else {
    exportObject = require("electron").remote.require("fs");
}

export default exportObject;
