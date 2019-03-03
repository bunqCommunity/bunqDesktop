import store from "store";
import { ipcRenderer } from "electron";
import settings from "../ImportWrappers/electronSettings";

export const SYNC_ON_STARTUP_LOCATION = "BUNQDESKTOP_SYNC_ON_STARTUP";
export const THEME_LOCATION = "BUNQDESKTOP_THEME";
export const ANALYTICS_ENABLED = "ANALYTICS_ENABLED";
export const LANGUAGE_LOCATION = "BUNQDESKTOP_LANGUAGE";
export const USE_NATIVE_FRAME_LOCATION = "USE_NATIVE_FRAME";
export const MINIMIZE_TO_TRAY_LOCATION = "MINIMIZE_TO_TRAY";
export const DISPLAY_TRAY_INFO_LOCATION = "DISPLAY_TRAY_INFO";
export const USE_STICKY_MENU_LOCATION = "USE_STICKY_MENU";
export const EVENT_COUNT_LIMIT_LOCATION = "EVENT_COUNT_LIMIT";
export const CHECK_INACTIVITY_ENABLED_LOCATION = "CHECK_INACTIVITY_ENABLED";
export const CHECK_INACTIVITY_DURATION_LOCATION = "CHECK_INACTIVITY_DURATION";
export const AUTOMATIC_UPDATE_ENABLED_LOCATION = "AUTOMATIC_UPDATE_ENABLED";
export const AUTOMATIC_UPDATE_SEND_NOTIFICATION_LOCATION = "AUTOMATIC_UPDATE_SEND_NOTIFICATION";
export const AUTOMATIC_UPDATE_DURATION_LOCATION = "AUTOMATIC_UPDATE_DURATION";
export const AUTOMATIC_THEME_CHANGE_LOCATION = "AUTOMATIC_THEME_CHANGE";
export const HIDE_BALANCE_LOCATION = "HIDE_BALANCE";

/**
 * maps settings to locations and defaults
 * ignore means it'll be ignored in the automatic load/save functions
 */
const settingsStoredMap = {
    sync_on_startup: { location: SYNC_ON_STARTUP_LOCATION, default: true },
    theme: { location: THEME_LOCATION, default: "DefaultTheme" },
    analytics_enabled: { location: ANALYTICS_ENABLED, default: false },
    language: { location: LANGUAGE_LOCATION, default: "en" },
    native_frame: { location: USE_NATIVE_FRAME_LOCATION, default: false },
    minimize_to_tray: { location: MINIMIZE_TO_TRAY_LOCATION, default: false },
    display_tray_info: { location: DISPLAY_TRAY_INFO_LOCATION, default: true },
    sticky_menu: { location: USE_STICKY_MENU_LOCATION, default: false },
    event_count_limit: {
        location: EVENT_COUNT_LIMIT_LOCATION,
        default: 100
    },
    check_inactivity: {
        location: CHECK_INACTIVITY_ENABLED_LOCATION,
        default: false
    },
    inactivity_check_duration: {
        location: CHECK_INACTIVITY_DURATION_LOCATION,
        default: 300
    },
    automatic_update_enabled: {
        location: AUTOMATIC_UPDATE_ENABLED_LOCATION,
        default: false
    },
    automatic_update_send_notification: {
        location: AUTOMATIC_UPDATE_SEND_NOTIFICATION_LOCATION,
        default: false
    },
    automatic_update_duration: {
        location: AUTOMATIC_UPDATE_DURATION_LOCATION,
        default: 300
    },
    automatic_theme_change: {
        location: AUTOMATIC_THEME_CHANGE_LOCATION,
        default: false
    },
    hide_balance: { location: HIDE_BALANCE_LOCATION, default: false },
    settings_location: { ignore: true }
};

// retrieves the stored value from the settings and falls back to default when possible
const getStoredValues = (useDefault = true) => {
    let settingsStoredValues = {};

    Object.keys(settingsStoredMap).forEach(settingsKey => {
        const settingsInfo = settingsStoredMap[settingsKey];
        if (settingsInfo.ignore) return;

        // attempt to get option from settings
        const storedValue = settings.get(settingsInfo.location);

        if (storedValue === undefined) {
            // if false, we don't include it
            if (useDefault) {
                // set default value
                settingsStoredValues[settingsKey] = settingsInfo.default;
            }
        } else {
            // set stored value
            settingsStoredValues[settingsKey] = storedValue;
        }
    });

    return settingsStoredValues;
};

const settingsStoredValues = getStoredValues();

export const defaultState = {
    ...settingsStoredValues,
    settings_location: settings.file()
};

// update global variable
window.BUNQDESKTOP_LANGUAGE_SETTING = settingsStoredValues.language;

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "OPTIONS_SET_GENERIC":
            const settingKey = action.payload.setting;
            const settingValue = action.payload.value;
            const settingInfo = settingsStoredMap[settingKey];

            if (!settingInfo) return { ...state };

            switch (settingKey) {
                case "display_tray_info":
                    ipcRenderer.send("set-tray-display", settingValue);
                    break;
            }

            settings.set(settingInfo.location, settingValue);
            return {
                ...state,
                [settingKey]: settingValue
            };

        case "OPTIONS_SET_LANGUAGE":
            settings.set(LANGUAGE_LOCATION, action.payload.language);

            // update global variable
            window.BUNQDESKTOP_LANGUAGE_SETTING = action.payload.language;
            return {
                ...state,
                language: action.payload.language
            };

        case "OPTIONS_OVERWRITE_SETTINGS_LOCATION":
            let targetLocation = action.payload.location;

            try {
                // update main process
                ipcRenderer.send("change-settings-path", targetLocation);

                // set the settinsg path
                settings.setPath(targetLocation);
            } catch (err) {
                targetLocation = state.settings_location;
            }

            // go through all settings and overwrite the new file with our state
            Object.keys(settingsStoredMap).forEach(settingsKey => {
                const settingsInfo = settingsStoredMap[settingsKey];
                if (settingsInfo.ignore) return;

                // overwrite the new location with the value stored in the state
                settings.set(settingsInfo.location, state[settingsKey]);
            });

            return {
                ...state,
                settings_location: targetLocation
            };

        case "OPTIONS_LOAD_SETTINGS_LOCATION":
            let targetLocation2 = action.payload.location;

            try {
                // update main process
                ipcRenderer.send("change-settings-path", targetLocation2);

                // set the settinsg path
                settings.setPath(targetLocation2);
            } catch (err) {
                targetLocation2 = state.settings_location;
            }

            // fetch stored values from the new location
            let storedValues = getStoredValues(false);

            // only overwrite if the new settings file contains these settings
            return {
                ...state,
                ...storedValues,
                settings_location: targetLocation2
            };

        case "OPTIONS_RESET_APPLICATION":
            // reset localstorage settings
            store.clearAll();

            // reset electron settings
            settings.deleteAll();

            const ImageIndexedDb = window.BunqDesktopClient.ImageIndexedDb;

            // clear image cache and reload once that completes
            ImageIndexedDb.clear().then(done => {
                location.reload();
            });

            return {
                ...state
            };
    }
    return state;
}
