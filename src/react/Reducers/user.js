import { ipcRenderer } from "electron";

const store = require("store");

export const USER_TYPE_LOCATION = "BUNQDESKTOP_USER_TYPE";

const userDefault = store.get(USER_TYPE_LOCATION) !== undefined ? store.get(USER_TYPE_LOCATION) : false;

export const defaultState = {
    user: false,
    user_type: userDefault,
    loading: false,
    initialCheck: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "USER_SET_INFO":
            store.set(USER_TYPE_LOCATION, action.payload.user_type);
            ipcRenderer.send("set-tray-loggedin", action.payload.user.display_name);

            return {
                ...state,
                user: action.payload.user,
                user_type: action.payload.user_type,
                limited_permissions: action.payload.user_type === "UserApiKey",
                initialCheck: true
            };

        case "USER_LOGOUT":
            store.remove(USER_TYPE_LOCATION);
            ipcRenderer.send("set-tray-loggedin", false);

            return {
                ...state,
                user: false,
                limited_permissions: false,
                user_type: false
            };

        case "USER_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "USER_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "USER_INITIAL_CHECK":
            return {
                ...state,
                initialCheck: true
            };

        case "USER_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(USER_TYPE_LOCATION);
            ipcRenderer.send("set-tray-loggedin", false);
            ipcRenderer.send("set-tray-balance", false);

            return {
                user: false,
                user_type: false,
                limited_permissions: false,
                loading: false,
                initialCheck: false
            };
    }
    return state;
};
