import store from "store";

const themeDefault =
    store.get("theme") !== undefined ? store.get("theme") : "DefaultTheme";

export const defaultState = {
    theme: themeDefault
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "THEME_SET":
            return {
                ...state,
                theme: action.payload.theme
            };
    }
    return state;
}
