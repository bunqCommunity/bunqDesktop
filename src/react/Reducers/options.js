import store from "store";
import localforage from "localforage";
const settings = require("electron").remote.require("electron-settings");

// configure the localforage instance
localforage.config({
    driver: localforage.INDEXEDDB,
    name: "BunqDesktop",
    version: 1.0,
    storeName: "bunq_desktop_images",
    description: "Image cache for bunq desktop in indexed db"
});

export const THEME_LOCATION = "BUNQDESKTOP_THEME";

const nativeFrameStored = settings.get("USE_NATIVE_FRAME");
const hideBalanceStored = store.get("HIDE_BALANCE");
const themeDefaultStored = store.get(THEME_LOCATION);

const nativeFrameDefault =
    nativeFrameStored !== undefined ? nativeFrameStored : false;

const hideBalanceDefault =
    hideBalanceStored !== undefined ? hideBalanceStored : false;

const themeDefault =
    themeDefaultStored !== undefined ? themeDefaultStored : "DefaultTheme";

export const defaultState = {
    theme: themeDefault,
    native_frame: nativeFrameDefault,
    hide_balance: hideBalanceDefault
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
        case "OPTIONS_SET_HIDE_BALANCE":
            store.set("HIDE_BALANCE", action.payload.hide_balance);
            return {
                ...state,
                hide_balance: action.payload.hide_balance
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
