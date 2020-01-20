import { app } from "electron";
import path from "path";
import jetpack from "fs-jetpack";

const userDataPath = app.getPath("userData");
const userDataDir = jetpack.cwd(app.getPath("userData"));
const defaultSettingsPath = path.join(userDataPath, "settings.json");
const settingsStoreFile = `SETTINGS_LOCATION`;

// ensure bunqdesktop directory exists
try {
    userDataDir.dir("./");
} catch (err) {}

const loadPath = () => {
    try {
        const settingsPath = userDataDir.read(settingsStoreFile, "utf8");

        if (settingsPath) {
            return settingsPath;
        }
    } catch (err) {
        // For some reason json can't be read
    }
    return defaultSettingsPath;
};

const savePath = settingsPath => {
    try {
        userDataDir.write(settingsStoreFile, settingsPath, {
            atomic: true
        });
        return true;
    } catch (err) {}
    return false;
};

export default {
    savePath: savePath,
    loadPath: loadPath
};
