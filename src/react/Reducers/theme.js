import store from "store";

export const THEME_LOCATION = "BUNQDESKTOP_THEME";

const themeDefault =
    store.get(THEME_LOCATION) !== undefined
        ? store.get(THEME_LOCATION)
        : "DefaultTheme";

export const defaultState = {
    theme: themeDefault
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "THEME_SET":
            store.set(THEME_LOCATION, action.payload.theme);
            return {
                ...state,
                theme: action.payload.theme
            };
    }
    return state;
}
