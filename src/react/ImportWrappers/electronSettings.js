let settings;

if (process.env.JEST) {
    settings = {
        get: () => {},
        set: () => {},
        file: () => {
            return "C:/a/test.json";
        }
    };
} else {
    settings = require("electron").remote.require("electron-settings");
}

export default settings;
