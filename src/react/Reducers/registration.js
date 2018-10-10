import store from "store";
import { SALT_LOCATION, API_KEY_IV_LOCATION, API_KEY_LOCATION, API_KEYS_LOCATION } from "../Actions/registration";

export const USE_NO_PASSWORD_LOCATION = "USE_NO_PASSWORD_LOCATION";
export const DEVICE_NAME_LOCATION = "BUNQDESKTOP_DEVICE_NAME";
export const ENVIRONMENT_LOCATION = "BUNQDESKTOP_ENVIRONMENT";

const deviceNameDefault = store.get(DEVICE_NAME_LOCATION) !== undefined ? store.get(DEVICE_NAME_LOCATION) : "My Device";
const useNoPasswordDefault =
    store.get(USE_NO_PASSWORD_LOCATION) !== undefined ? store.get(USE_NO_PASSWORD_LOCATION) : false;
const environmentDefault =
    store.get(ENVIRONMENT_LOCATION) !== undefined ? store.get(ENVIRONMENT_LOCATION) : "PRODUCTION";
const storedApiKeysDefault = store.get(API_KEYS_LOCATION) !== undefined ? store.get(API_KEYS_LOCATION) : [];

export const defaultState = {
    // unencrypted api key, this should NEVER be stored elsewhere
    api_key: false,
    permitted_ips: [],
    encrypted_api_key: false,

    // if true there is a stored api key
    has_stored_api_key: store.get(API_KEY_LOCATION) !== undefined,

    // list of encrypted api keys
    stored_api_keys: storedApiKeysDefault,

    // if true, the application will try to load the encryption keys using a default password
    use_no_password: useNoPasswordDefault,
    device_name: deviceNameDefault,
    environment: environmentDefault,
    derivedPassword: false,
    identifier: false,
    loading: false,
    status_message: ""
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REGISTRATION_SET_API_KEY":
            return {
                ...state,
                api_key: action.payload.api_key,
                permitted_ips: action.payload.permitted_ips,
                encrypted_api_key: action.payload.encrypted_api_key
            };

        case "REGISTRATION_ENSURE_STORED_API_KEY":
            const currentApiKeys = [...state.stored_api_keys];
            const encryptedKey = action.payload.api_key;
            const encryptedKeyIv = action.payload.api_key_iv;

            const index = currentApiKeys.findIndex(storedApiKey => {
                // this is the same stored api key
                return storedApiKey.api_key === encryptedKey;
            });

            const storedApiKeyInfo = {
                // link to current password by the identifier
                identifier: state.identifier,
                // key and iv for this api key
                api_key: encryptedKey,
                api_key_iv: encryptedKeyIv,
                // device name so we can easily recognize it
                device_name: state.device_name,
                // environment for this api key
                environment: state.environment,
                // helps mark keys as OAuth
                isOAuth: false
            };

            if (index > -1) {
                // existing was found
                currentApiKeys[index] = storedApiKeyInfo;
            } else {
                // add now
                currentApiKeys.push(storedApiKeyInfo);
            }

            // update stored api keys aswell
            store.set(API_KEYS_LOCATION, currentApiKeys);
            return {
                ...state,
                stored_api_keys: currentApiKeys
            };

        // marks currently selected API key as OAuth if it is stored
        case "REGISTRATION_SET_OAUTH_STORED_API_KEY":
            const storedApiKeys = [...state.stored_api_keys];

            // try to find the currently used API key in the stored API keys
            const currentApiKeyIndex = storedApiKeys.findIndex(storedApiKey => {
                // this is the same stored api key
                return storedApiKey.api_key === state.encrypted_api_key;
            });

            // check if index was found and if the object exists
            if (currentApiKeyIndex > -1 && storedApiKeys[currentApiKeyIndex]) {
                // mark this stored key as OAuth type
                storedApiKeys[currentApiKeyIndex].isOAuth = true;

                // update stored api keys aswell
                store.set(API_KEYS_LOCATION, storedApiKeys);
            }

            return {
                ...state,
                stored_api_keys: storedApiKeys
            };

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
                encrypted_api_key: false,
                stored_api_keys: [],
                has_stored_api_key: false,
                derivedPassword: false
            };

        case "REGISTRATION_LOG_OUT":
            store.remove(API_KEY_LOCATION);
            store.remove(API_KEY_IV_LOCATION);
            return {
                ...state,
                api_key: false,
                encrypted_api_key: false,
                has_stored_api_key: false,
                derivedPassword: false
            };

        case "REGISTRATION_RESET_TO_API_SCREEN":
            store.remove(API_KEY_LOCATION);
            store.remove(API_KEY_IV_LOCATION);
            return {
                ...state,
                api_key: false,
                encrypted_api_key: false,
                has_stored_api_key: false
            };

        case "REGISTRATION_SET_PASSWORD":
            return {
                ...state,
                derivedPassword: action.payload.derivedPassword,
                identifier: action.payload.identifier
            };

        case "REGISTRATION_USE_NO_PASSWORD":
            store.set(USE_NO_PASSWORD_LOCATION, true);
            return {
                ...state,
                use_no_password: true
            };

        case "REGISTRATION_USE_PASSWORD":
            store.set(USE_NO_PASSWORD_LOCATION, false);
            return {
                ...state,
                use_no_password: false
            };

        case "REGISTRATION_CLEAR_PASSWORD":
            store.set(USE_NO_PASSWORD_LOCATION, false);
            return {
                ...state,
                derivedPassword: false,
                use_no_password: false
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
