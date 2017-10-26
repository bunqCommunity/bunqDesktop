import store from "store";
const settings = require("electron").remote.require("electron-settings");

export const THEME_LOCATION = "BUNQDESKTOP_THEME";

const nativeFrameStored = settings.get("USE_NATIVE_FRAME");
const themeDefaultStored = store.get(THEME_LOCATION);

const nativeFrameDefault =
    nativeFrameStored !== undefined ? nativeFrameStored : false;
const themeDefault =
    themeDefaultStored !== undefined ? themeDefaultStored : "DefaultTheme";

export const defaultState = {
    theme: themeDefault,
    native_frame: nativeFrameDefault
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
    }
    return state;
}
