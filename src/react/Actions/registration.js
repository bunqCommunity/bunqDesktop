import store from "store";
import Logger from "../Helpers/Logger";
import { decryptString, derivePasswordKey, encryptString } from "../Helpers/Crypto";
import { applicationSetStatus } from "./application";
import { openSnackbar } from "./snackbar";

export const SALT_LOCATION = "BUNQDESKTOP_PASSWORD_SALT";
export const API_KEY_LOCATION = "BUNQDESKTOP_API_KEY";
export const API_KEYS_LOCATION = "BUNQDESKTOP_API_KEYS";
export const API_KEY_IV_LOCATION = "BUNQDESKTOP_API_IV";

/**
 * Only sets the api key without extra actions
 * @param api_key
 * @param encrypted_api_key
 * @returns {{type: string, payload: {api_key: *}}}
 */
export function registrationSetApiKeyBasic(api_key, encrypted_api_key = false, permitted_ips = []) {
    return {
        type: "REGISTRATION_SET_API_KEY",
        payload: {
            api_key: api_key,
            encrypted_api_key: encrypted_api_key,
            permitted_ips: permitted_ips
        }
    };
}

/**
 * Stores the api key encrypted in storage
 * @param api_key
 * @param encryptionKey
 * @returns {function(*)}
 */
export function registrationSetApiKey(api_key, derivedPassword, permitted_ips = []) {
    return dispatch => {
        encryptString(api_key, derivedPassword.key)
            .then(encrypedData => {
                store.set(API_KEY_LOCATION, encrypedData.encryptedString);
                store.set(API_KEY_IV_LOCATION, encrypedData.iv);

                // now store the salt for the currently used password
                store.set(SALT_LOCATION, derivedPassword.salt);

                dispatch(registrationSetApiKeyBasic(api_key, encrypedData.encryptedString, permitted_ips));
                dispatch(registrationEnsureStoredApiKey(encrypedData.encryptedString, encrypedData.iv));
            })
            .catch(Logger.error);
    };
}

/**
 * Ensures the stored api_keys contain an encrypted key and iv set
 * @param apiKey
 * @param apiKeyIv
 * @returns {{type: string, payload: {api_key: *, api_key_iv: *}}}
 */
export function registrationEnsureStoredApiKey(apiKey, apiKeyIv) {
    return {
        type: "REGISTRATION_ENSURE_STORED_API_KEY",
        payload: {
            api_key: apiKey,
            api_key_iv: apiKeyIv
        }
    };
}

/**
 *  Marks the currently used API key as OAuth type in the stored keys if possible
 * @returns {{type: string}}
 */
export function registrationSetOAuthStoredApiKey() {
    return {
        type: "REGISTRATION_SET_OAUTH_STORED_API_KEY"
    };
}

/**
 * Removes a stored api key
 * @param index
 * @returns {{type: string, payload: {index: *}}}
 */
export function registrationRemoveStoredApiKey(index) {
    return {
        type: "REGISTRATION_REMOVE_STORED_API_KEY",
        payload: {
            index: index
        }
    };
}

/**
 * Loads the api key from storage and decrypts it
 * @param derivedPassword
 * @returns {function(*)}
 */
export function registrationLoadApiKey(derivedPassword) {
    const failedMessage = window.t("We failed to load the stored API key Try again or re-enter the key");
    const statusMessage = window.t("Attempting to load your API key");

    return dispatch => {
        dispatch(registrationLoading());
        dispatch(applicationSetStatus(statusMessage));

        if (!store.get(API_KEY_LOCATION) || !store.get(API_KEY_IV_LOCATION)) {
            dispatch(registrationNotLoading());
            // no api key stored
            return false;
        }

        const encryptedApiKey = store.get(API_KEY_LOCATION);
        const encryptedApiKeyIV = store.get(API_KEY_IV_LOCATION);

        decryptString(encryptedApiKey, derivedPassword.key, encryptedApiKeyIV)
            .then(decryptedString => {
                dispatch(registrationNotLoading());

                // validate decrypted result
                if (decryptedString.length !== 64) {
                    // clear the password so the user can try again
                    dispatch(registrationClearPassword());
                    dispatch(openSnackbar(failedMessage));
                    Logger.error(`Failed to load API key: with length: ${decryptedString.length}`);

                    return;
                }

                dispatch(registrationSetApiKeyBasic(decryptedString, encryptedApiKey));
            })
            .catch(_ => {
                // clear the password so the user can try again
                dispatch(registrationClearPassword());
                dispatch(registrationNotLoading());
                dispatch(openSnackbar(failedMessage));
            });
    };
}

/**
 * Loads an api key from stored api key list and decrypts it
 * @param BunqJSClient
 * @param storedKeyIndex
 * @param derivedPassword
 * @returns {function(*)}
 */
export function registrationLoadStoredApiKey(BunqJSClient, storedKeyIndex, derivedPassword) {
    const failedMessage = window.t("We failed to load the stored API key Try again or re-enter the key");
    const statusMessage = window.t("Attempting to load your API key");
    const statusMessage2 = window.t("Removing data from previous session");

    return dispatch => {
        dispatch(registrationLoading());
        dispatch(applicationSetStatus(statusMessage));

        if (!store.get(API_KEYS_LOCATION)) {
            dispatch(registrationNotLoading());
            // no api key stored
            return false;
        }

        // get currently stored api key
        const encryptedApiKeys = store.get(API_KEYS_LOCATION);
        if (!encryptedApiKeys || !encryptedApiKeys[storedKeyIndex]) {
            dispatch(registrationNotLoading());
            // no api key stored on this index
            return false;
        }

        const encryptedApiKeyInfo = encryptedApiKeys[storedKeyIndex];
        const encryptedApiKey = encryptedApiKeyInfo.api_key;
        const encryptedApiKeyIV = encryptedApiKeyInfo.api_key_iv;
        const encryptedEnvironment = encryptedApiKeyInfo.environment;

        decryptString(encryptedApiKey, derivedPassword.key, encryptedApiKeyIV)
            .then(decryptedString => {
                // validate decrypted result
                if (decryptedString.length !== 64) {
                    // clear the password so the user can try again
                    dispatch(registrationClearPassword());
                    dispatch(registrationNotLoading());
                    dispatch(openSnackbar(failedMessage));
                    Logger.error(`Failed to load API key: with length: ${decryptedString.length}`);

                    return;
                }

                // overwrite currently stored api key with this one
                store.set(API_KEY_LOCATION, encryptedApiKey);
                store.set(API_KEY_IV_LOCATION, encryptedApiKeyIV);

                // set the correct environment
                dispatch(registrationSetEnvironment(encryptedEnvironment));

                // check if api key is different
                if (BunqJSClient.apiKey && BunqJSClient.apiKey !== decryptedString) {
                    // remove the old api key
                    dispatch(applicationSetStatus(statusMessage2));

                    // destroy the session associated with the previous
                    dispatch(registrationSetApiKeyBasic(decryptedString, encryptedApiKey));
                    dispatch(registrationNotLoading());
                } else {
                    // nothing changes, just set the api key but do nothing else
                    dispatch(registrationNotLoading());
                    dispatch(registrationSetApiKeyBasic(decryptedString, encryptedApiKey));
                }
            })
            .catch(_ => {
                dispatch(registrationClearPassword());
                dispatch(registrationNotLoading());
                // clear the password so the user can try again
                dispatch(openSnackbar(failedMessage));
            });
    };
}

/**
 * Derive a password and store the salt
 * @param password
 * @returns {function(*)}
 */
export function registrationDerivePassword(password) {
    const statusMessage = window.t("Creating a secure key from your password");

    return dispatch => {
        dispatch(registrationLoading());
        dispatch(applicationSetStatus(statusMessage));

        let salt = false;
        if (store.get(SALT_LOCATION) !== undefined) {
            // we found a salt so we try to use it for deriving the password
            salt = store.get(SALT_LOCATION);
        }

        // derive the password itself
        derivePasswordKey(password, salt, 250000)
            .then(derivedPassword => {
                // create a quick identifier based on this exact key
                derivePasswordKey(derivedPassword.key + "identifier", salt, 100000)
                    .then(derivedIdentifier => {
                        dispatch(registrationNotLoading());
                        dispatch(registrationSetDerivedPassword(derivedPassword, derivedIdentifier.key));
                    })
                    .catch(error => {
                        Logger.error(error);
                        dispatch(registrationNotLoading());
                    });
            })
            .catch(error => {
                Logger.error(error);
                dispatch(registrationNotLoading());
            });
    };
}

/**
 * Log out without removing the stored apikey and password
 * @param BunqJSClient
 * @returns {function(*)}
 */
export function registrationResetToApiScreen(BunqJSClient) {
    return dispatch => {
        BunqJSClient.destroySession().then(_ => {
            dispatch({
                type: "REGISTRATION_RESET_TO_API_SCREEN"
            });
        });
    };
}

/**
 * Log out without removing the stored apikey and password
 * and keep the api Installation and Device installation
 * @param BunqJSClient
 * @returns {function(*)}
 */
export function registrationResetToApiScreenSoft(BunqJSClient) {
    return dispatch => {
        BunqJSClient.destroyApiSession(true).then(_ => {
            dispatch({
                type: "REGISTRATION_RESET_TO_API_SCREEN"
            });
        });
    };
}

/**
 * Log out without removing the stored apikey
 * @param BunqJSClient
 * @param resetPassword
 * @returns {function(*)}
 */
export function registrationLogOut(BunqJSClient, resetPassword = false) {
    return dispatch => {
        BunqJSClient.destroyApiSession().then(_ => {
            dispatch({
                type: "REGISTRATION_LOG_OUT",
                payload: {
                    resetPassword: resetPassword
                }
            });
        });
    };
}

/**
 * Remove all api keys, passwords and other private data
 * @param BunqJSClient
 * @param resetPassword
 * @returns {function(*)}
 */
export function registrationClearPrivateData(BunqJSClient) {
    return dispatch => {
        BunqJSClient.destroySession().then(_ => {
            dispatch({
                type: "REGISTRATION_CLEAR_PRIVATE_DATA"
            });
        });
    };
}

/**
 * Set the device name
 * @param device_name
 * @returns {{type: string, payload: {device_name: *}}}
 */
export function registrationSetDeviceName(device_name) {
    return {
        type: "REGISTRATION_SET_DEVICE_NAME",
        payload: {
            device_name: device_name
        }
    };
}

/**
 * Set the environment
 * @param environment
 * @returns {{type: string, payload: {environment: *}}}
 */
export function registrationSetEnvironment(environment) {
    if (environment !== "PRODUCTION" && environment !== "SANDBOX") environment = "SANDBOX";
    return {
        type: "REGISTRATION_SET_ENVIRONMENT",
        payload: {
            environment: environment
        }
    };
}

/**
 * Clear the password
 * @returns {{type: string}}
 */
export function registrationClearPassword() {
    return {
        type: "REGISTRATION_CLEAR_PASSWORD"
    };
}

/**
 * Clear all user info currently in the application
 * @returns {{type: string}}
 */
export function registrationClearUserInfo() {
    return {
        type: "REGISTRATION_CLEAR_USER_INFO"
    };
}

/**
 * Store the derived password
 * @param derivedPassword
 * @returns {{type: string, payload: {derivedPassword: *}}}
 */
export function registrationSetDerivedPassword(derivedPassword, identifier) {
    return {
        type: "REGISTRATION_SET_PASSWORD",
        payload: {
            derivedPassword: derivedPassword,
            identifier: identifier
        }
    };
}

/**
 * @returns {function(*)}
 */
export function registrationUseNoPassword() {
    return dispatch => {
        dispatch(registrationSetUseNoPassword());
        dispatch(registrationDerivePassword("SOME_DEFAULT_PASSWORD"));
    };
}

/**
 * @returns {function(*)}
 */
export function registrationSetUseNoPassword() {
    return {
        type: "REGISTRATION_USE_NO_PASSWORD"
    };
}

/**
 * @param password
 * @returns {function(*)}
 */
export function registrationUsePassword(password) {
    return dispatch => {
        dispatch(registrationSetUsePassword());
        dispatch(registrationDerivePassword(password));
    };
}

/**
 * @returns {function(*)}
 */
export function registrationSetUsePassword() {
    return {
        type: "REGISTRATION_USE_PASSWORD"
    };
}

/**
 * Generic registraition loading state
 * @returns {{type: string}}
 */
export function registrationLoading() {
    return {
        type: "REGISTRATION_LOADING"
    };
}

/**
 * Generic registraition not loading state
 * @returns {{type: string}}
 */
export function registrationNotLoading() {
    return {
        type: "REGISTRATION_NOT_LOADING"
    };
}
