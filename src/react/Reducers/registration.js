import store from "store";

import {
    SALT_LOCATION,
    API_KEY_LOCATION,
    API_KEYS_LOCATION,
    API_KEY_IV_LOCATION,
    USE_NO_PASSWORD_LOCATION,
    DEVICE_NAME_LOCATION,
    ENVIRONMENT_LOCATION
} from "../BunqDesktopClient";

export const defaultState = {
    // unencrypted api key, this should NEVER be stored elsewhere
    api_key: false,
    permitted_ips: [],
    encrypted_api_key: false,

    // if true there is a stored api key
    has_stored_api_key: false,

    // list of encrypted api keys
    stored_api_keys: [],

    // if true, the application will try to load the encryption keys using a default password
    use_no_password: false,
    device_name: "My device",
    environment: "PRODUCTION",
    derived_password: false,
    identifier: false,
    loading: false,
    status_message: ""
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REGISTRATION_REMOVE_STORED_API_KEY":
            const currentApiKeys2 = [...state.stored_api_keys];

            // remove this key
            currentApiKeys2.splice(action.payload.index, 1);

            // update stored api keys aswell
            store.set(API_KEYS_LOCATION, currentApiKeys2);
            return {
                ...state,
                stored_api_keys: currentApiKeys2
            };

        case "REGISTRATION_SET_STORED_API_KEYS":
            return {
                ...state,
                stored_api_keys: action.payload.stored_api_keys
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

        case "REGISTRATION_LOG_OUT":
            store.remove(API_KEY_LOCATION);
            store.remove(API_KEY_IV_LOCATION);
            return {
                ...state,
                api_key: false,
                ready: false,
                encrypted_api_key: false,
                has_stored_api_key: false,
                derived_password: false
            };

        case "REGISTRATION_RESET_TO_LOGIN":
            store.remove(API_KEY_LOCATION);
            store.remove(API_KEY_IV_LOCATION);
            return {
                ...state,
                api_key: false,
                ready: false,
                encrypted_api_key: false,
                has_stored_api_key: false
            };

        case "REGISTRATION_RESET_TO_LOGIN_PASSWORD":
            store.remove(API_KEY_LOCATION);
            store.remove(API_KEY_IV_LOCATION);
            return {
                ...state,
                api_key: false,
                ready: false,
                encrypted_api_key: false,
                has_stored_api_key: false
            };

        case "REGISTRATION_CLEAR_PASSWORD":
            store.set(USE_NO_PASSWORD_LOCATION, false);
            return {
                ...state,
                derived_password: false,
                use_no_password: false
            };

        case "REGISTRATION_SET_BUNQ_DESKTOP_CLIENT_DATA":
            return {
                ...state,
                derived_password: action.payload.derived_password,
                derived_password_salt: action.payload.derived_password_salt,
                identifier: action.payload.identifier,

                api_key: action.payload.api_key,
                encrypted_api_key: action.payload.encrypted_api_key,
                encrypted_api_key_iv: action.payload.encrypted_api_key_iv,
                device_name: action.payload.device_name,
                environment: action.payload.environment,
                permitted_ips: action.payload.permitted_ips,

                has_stored_api_key: action.payload.has_stored_api_key,
                stored_api_keys: action.payload.stored_api_keys,
                use_no_password: action.payload.use_no_password
            };

        case "REGISTRATION_READY":
            return {
                ...state,
                ready: true
            };
        case "REGISTRATION_NOT_READY":
            return {
                ...state,
                ready: false
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

        case "REGISTRATION_CLEAR_PRIVATE_DATA":
            // remove the stored key data
            store.remove(SALT_LOCATION);
            store.remove(API_KEY_LOCATION);
            store.remove(API_KEYS_LOCATION);
            store.remove(API_KEY_IV_LOCATION);
            // reset use-no-password setting back to default
            store.set(USE_NO_PASSWORD_LOCATION, false);
            return {
                ...state,
                api_key: false,
                ready: false,
                encrypted_api_key: false,
                stored_api_keys: [],
                has_stored_api_key: false,
                derived_password: false
            };

    }
    return state;
};
