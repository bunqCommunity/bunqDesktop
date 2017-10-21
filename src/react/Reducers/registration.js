import store from "store";
import {
    SALT_LOCATION,
    API_KEY_IV_LOCATION,
    API_KEY_LOCATION
} from "../Actions/registration";

export const DEVICE_NAME_LOCATION = "BUNQDESKTOP_DEVICE_NAME";
export const ENVIRONMENT_LOCATION = "BUNQDESKTOP_ENVIRONMENT";

const device_nameDefault =
    store.get(DEVICE_NAME_LOCATION) !== undefined
        ? store.get(DEVICE_NAME_LOCATION)
        : "My Device";
const environmentDefault =
    store.get(ENVIRONMENT_LOCATION) !== undefined
        ? store.get(ENVIRONMENT_LOCATION)
        : "PRODUCTION";

export const defaultState = {
    // unencrypted api key, this should NEVER be stored elsewhere
    api_key: false,
    // if true there is a stored api key
    has_stored_api_key: store.get(API_KEY_LOCATION) !== undefined,
    device_name: device_nameDefault,
    environment: environmentDefault,
    derivedPassword: false,
    loading: false,
    status_message: ""
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REGISTRATION_SET_API_KEY":
            return {
                ...state,
                api_key: action.payload.api_key
            };

        case "REGISTRATION_SET_DEVICE_NAME":
            store.set(DEVICE_NAME_LOCATION, action.payload.device_name);
            return {
                ...state,
                device_name: action.payload.device_name
            };

        case "REGISTRATION_SET_ENVIRONMENT":
            store.set(ENVIRONMENT_LOCATION, action.payload.environment);
            return {
                ...state,
                environment: action.payload.environment
            };

        case "REGISTRATION_CLEAR_API_KEY":
            store.remove(SALT_LOCATION);
            store.remove(API_KEY_LOCATION);
            store.remove(API_KEY_IV_LOCATION);
            return {
                ...state,
                api_key: false,
                has_stored_api_key: false,
            };

        case "REGISTRATION_SET_PASSWORD":
            return {
                ...state,
                derivedPassword: action.payload.derivedPassword
            };

        case "REGISTRATION_CLEAR_PASSWORD":
            return {
                ...state,
                derivedPassword: false
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
