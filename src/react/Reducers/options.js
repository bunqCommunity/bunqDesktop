import store from "store";
import localforage from "localforage";

const remote = require("electron").remote;
const settings = remote.require("electron-settings");
const fs = remote.require("fs");
const path = remote.require("path");
const app = remote.app;

const getSettingsLockLocation = () => {
    return `${app.getPath(
        "userData"
    )}${path.sep}..${path.sep}BunqDesktop${path.sep}SETTINGS_LOCATION`;
};

// configure the localforage instance
localforage.config({
    driver: localforage.INDEXEDDB,
    name: "BunqDesktop",
    version: 1.0,
    storeName: "bunq_desktop_images",
    description: "Image cache for BunqDesktop in IndexedDB"
});

export const THEME_LOCATION = "BUNQDESKTOP_THEME";
export const USE_NATIVE_FRAME_LOCATION = "USE_NATIVE_FRAME";
export const MINIMIZE_TO_TRAY_LOCATION = "MINIMIZE_TO_TRAY";
export const USE_STICKY_MENU_LOCATION = "USE_STICKY_MENU";
export const CHECK_INACTIVITY_ENABLED_LOCATION = "CHECK_INACTIVITY_ENABLED";
export const CHECK_INACTIVITY_DURATION_LOCATION = "CHECK_INACTIVITY_DURATION";
export const HIDE_BALANCE_LOCATION = "HIDE_BALANCE";

// get stored values
const nativeFrameStored = settings.get(USE_NATIVE_FRAME_LOCATION);
const minimizeToTrayStored = settings.get(MINIMIZE_TO_TRAY_LOCATION);
const stickyMenuStored = settings.get(USE_STICKY_MENU_LOCATION);
const checkInactivityStored = settings.get(CHECK_INACTIVITY_ENABLED_LOCATION);
const inactivityCheckDurationStored = settings.get(
    CHECK_INACTIVITY_DURATION_LOCATION
);
const hideBalanceStored = settings.get(HIDE_BALANCE_LOCATION);
const themeDefaultStored = settings.get(THEME_LOCATION);

// default to false/null values
const nativeFrameDefault =
    nativeFrameStored !== undefined ? nativeFrameStored : false;
const minimizeToTrayDefault =
    minimizeToTrayStored !== undefined ? minimizeToTrayStored : false;
const stickyMenuDefault =
    stickyMenuStored !== undefined ? stickyMenuStored : false;
const checkInactivityDefault =
    checkInactivityStored !== undefined ? checkInactivityStored : false;
const inactivityCheckDurationDefault =
    inactivityCheckDurationStored !== undefined
        ? inactivityCheckDurationStored
        : 300;
const hideBalanceDefault =
    hideBalanceStored !== undefined ? hideBalanceStored : false;
const settingsLocationDefault = fs
    .readFileSync(getSettingsLockLocation())
    .toString();
const themeDefault =
    themeDefaultStored !== undefined ? themeDefaultStored : "DefaultTheme";

export const defaultState = {
    theme: themeDefault,
    minimize_to_tray: minimizeToTrayDefault,
    native_frame: nativeFrameDefault,
    sticky_menu: stickyMenuDefault,
    hide_balance: hideBalanceDefault,
    check_inactivity: checkInactivityDefault,
    settings_location: settingsLocationDefault,
    inactivity_check_duration: inactivityCheckDurationDefault
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "OPTIONS_SET_THEME":
            settings.set(THEME_LOCATION, action.payload.theme);
            return {
                ...state,
                theme: action.payload.theme
            };

        case "OPTIONS_SET_HIDE_MINIMIZE_TO_TRAY":
            settings.set(
                MINIMIZE_TO_TRAY_LOCATION,
                action.payload.minimize_to_tray
            );
            return {
                ...state,
                minimize_to_tray: action.payload.minimize_to_tray
            };

        case "OPTIONS_SET_NATIVE_FRAME":
            settings.set(
                USE_NATIVE_FRAME_LOCATION,
                action.payload.native_frame
            );
            return {
                ...state,
                native_frame: action.payload.native_frame
            };

        case "OPTIONS_SET_STICKY_MENU":
            settings.set(USE_STICKY_MENU_LOCATION, action.payload.sticky_menu);
            return {
                ...state,
                sticky_menu: action.payload.sticky_menu
            };

        case "OPTIONS_SET_CHECK_INACTIVITY":
            settings.set(
                CHECK_INACTIVITY_ENABLED_LOCATION,
                action.payload.check_inactivity
            );
            return {
                ...state,
                check_inactivity: action.payload.check_inactivity
            };

        case "OPTIONS_SET_SET_INACTIVITY_DURATION":
            settings.set(
                CHECK_INACTIVITY_DURATION_LOCATION,
                action.payload.inactivity_check_duration
            );
            return {
                ...state,
                inactivity_check_duration:
                    action.payload.inactivity_check_duration
            };

        case "OPTIONS_SET_HIDE_BALANCE":
            settings.set(HIDE_BALANCE_LOCATION, action.payload.hide_balance);
            return {
                ...state,
                hide_balance: action.payload.hide_balance
            };

        case "OPTIONS_SET_SETTINGS_LOCATION":
            let targetLocation = action.payload.location;

            try {
                // check if file exists and is writeable
                fs.writeFileSync(getSettingsLockLocation(), targetLocation);
                settings.setPath(targetLocation);

                // set our current settings in this file
                settings.set(USE_STICKY_MENU_LOCATION, state.sticky_menu);
                settings.set(THEME_LOCATION, state.theme);
                settings.set(MINIMIZE_TO_TRAY_LOCATION, state.minimize_to_tray);
                settings.set(USE_NATIVE_FRAME_LOCATION, state.native_frame);
                settings.set(
                    CHECK_INACTIVITY_ENABLED_LOCATION,
                    state.check_inactivity
                );
                settings.set(
                    CHECK_INACTIVITY_DURATION_LOCATION,
                    state.inactivity_check_duration
                );
                settings.set(HIDE_BALANCE_LOCATION, state.hide_balance);
            } catch (err) {
                targetLocation = state.settings_location;
                console.error(err);
            }
            return {
                ...state,
                settings_location: targetLocation
            };

        case "OPTIONS_RESET_APPLICATION":
            // reset localstorage settings
            store.clearAll();

            // reset electron settings
            settings.deleteAll();

            // clear image cache and reload once that completes
            localforage.clear().then(done => {
                location.reload();
            });

            return {
                ...state
            };
    }
    return state;
}
