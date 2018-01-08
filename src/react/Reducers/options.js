import store from "store";
const settings = require("electron").remote.require("electron-settings");

export const THEME_LOCATION = "BUNQDESKTOP_THEME";

// get stored values
const nativeFrameStored = settings.get("USE_NATIVE_FRAME");
const checkInactivityStored = settings.get("CHECK_INACTIVITY_DURATION");
const inactivityCheckDurationStored = settings.get("CHECK_INACTIVITY_ENABLED");
const hideBalanceStored = store.get("HIDE_BALANCE");
const themeDefaultStored = store.get(THEME_LOCATION);

// default to false/null values
const nativeFrameDefault =
    nativeFrameStored !== undefined ? nativeFrameStored : false;
const checkInactivityDefault =
    checkInactivityStored !== undefined ? checkInactivityStored : false;
const inactivityCheckDurationDefault =
    inactivityCheckDurationStored !== undefined
        ? inactivityCheckDurationStored
        : 300;
const hideBalanceDefault =
    hideBalanceStored !== undefined ? hideBalanceStored : false;
const themeDefault =
    themeDefaultStored !== undefined ? themeDefaultStored : "DefaultTheme";

export const defaultState = {
    theme: themeDefault,
    native_frame: nativeFrameDefault,
    hide_balance: hideBalanceDefault,
    check_inactivity: checkInactivityDefault,
    inactivity_check_duration: inactivityCheckDurationDefault
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "OPTIONS_SET_THEME":
            store.set(THEME_LOCATION, action.payload.theme);
            return {
                ...state,
                theme: action.payload.theme
            };

        case "OPTIONS_SET_NATIVE_FRAME":
            settings.set("USE_NATIVE_FRAME", action.payload.native_frame);
            return {
                ...state,
                native_frame: action.payload.native_frame
            };

        case "OPTIONS_SET_CHECK_INACTIVITY":
            settings.set(
                "CHECK_INACTIVITY_ENABLED",
                action.payload.check_inactivity
            );
            return {
                ...state,
                check_inactivity: action.payload.check_inactivity
            };
        case "OPTIONS_SET_SET_INACTIVITY_DURATION":
            settings.set(
                "CHECK_INACTIVITY_DURATION",
                action.payload.inactivity_check_duration
            );
            return {
                ...state,
                inactivity_check_duration:
                    action.payload.inactivity_check_duration
            };

        case "OPTIONS_SET_HIDE_BALANCE":
            store.set("HIDE_BALANCE", action.payload.hide_balance);
            return {
                ...state,
                hide_balance: action.payload.hide_balance
            };
    }
    return state;
}
