const store = require("store");

const api_keyDefault =
    store.get("api_key") !== undefined ? store.get("api_key") : false;
const device_nameDefault =
    store.get("device_name") !== undefined
        ? store.get("device_name")
        : "My Device";
const environmentDefault =
    store.get("environment") !== undefined
        ? store.get("environment")
        : "PRODUCTION";

export const defaultState = {
    api_key: api_keyDefault,
    device_name: device_nameDefault,
    environment: environmentDefault,
    loading: false,
    status_message: ""
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REGISTRATION_SET_API_KEY":
            store.set("api_key", action.payload.api_key);
            return {
                ...state,
                api_key: action.payload.api_key
            };
        case "REGISTRATION_SET_DEVICE_NAME":
            store.set("device_name", action.payload.device_name);
            return {
                ...state,
                device_name: action.payload.device_name
            };
        case "REGISTRATION_SET_ENVIRONMENT":
            store.set("environment", action.payload.environment);
            return {
                ...state,
                environment: action.payload.environment
            };
        case "REGISTRATION_SET_STATUS_MESSAGE":
            return {
                ...state,
                status_message: action.payload.status_message
            };

        case "REGISTRATION_CLEAR_API_KEY":
            store.remove("api_key");
            return {
                ...state,
                api_key: false
            };

        case "REGISTRATION_LOADING":
            return {
                ...state,
                loading: true
            };
        case "REGISTRATION_NOT_LOADING":
            return {
                ...state,
                loading: false
            };
    }
    return state;
};
