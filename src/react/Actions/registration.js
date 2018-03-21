import store from "store";
import Logger from "../Helpers/Logger";
import {
    decryptString,
    derivePasswordKey,
    encryptString
} from "../Helpers/Crypto";
import { applicationSetStatus } from "./application";
import { openSnackbar } from "./snackbar";

export const SALT_LOCATION = "BUNQDESKTOP_PASSWORD_SALT";
export const API_KEY_LOCATION = "BUNQDESKTOP_API_KEY";
export const API_KEY_IV_LOCATION = "BUNQDESKTOP_API_IV";

/**
 * Stores the api key encrypted in storage
 * @param api_key
 * @param encryptionKey
 * @returns {function(*)}
 */
export function registrationSetApiKey(api_key, derivedPassword) {
    return dispatch => {
        encryptString(api_key, derivedPassword.key)
            .then(encrypedData => {
                store.set(API_KEY_LOCATION, encrypedData.encryptedString);
                store.set(API_KEY_IV_LOCATION, encrypedData.iv);

                // now store the salt for the currently used password
                store.set(SALT_LOCATION, derivedPassword.salt);

                dispatch({
                    type: "REGISTRATION_SET_API_KEY",
                    payload: {
                        api_key: api_key
                    }
                });
            })
            .catch(Logger.error);
    };
}

/**
 * Loads the api key from storage and decrypts it
 * @param derivedPassword
 * @returns {function(*)}
 */
export function registrationLoadApiKey(derivedPassword) {
    return dispatch => {
        dispatch(registrationLoading());
        dispatch(applicationSetStatus("Attempting to load your API key"));

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

                const hexPattern = /[0-9A-Fa-f]*/g;
                if (!hexPattern.test(decryptedString)) {
                    Logger.error(
                        "Non-hex values found in decrypted api key"
                    );
                }

                // validate decrypted result
                if (decryptedString.length !== 64) {
                    // clear the password so the user can try again
                    dispatch(registrationClearPassword());
                    dispatch(
                        openSnackbar(
                            "We failed to load the stored API key. Try again or re-enter the key."
                        )
                    );
                    Logger.error(
                        `Failed to load API key: ${decryptedString} with length: ${decryptedString.length}`
                    );

                    return;
                }
                dispatch({
                    type: "REGISTRATION_SET_API_KEY",
                    payload: {
                        api_key: decryptedString
                    }
                });
            })
            .catch(_ => {
                dispatch(registrationNotLoading());
                // clear the password so the user can try again
                dispatch(registrationClearPassword());
                dispatch(
                    openSnackbar(
                        "We failed to load the stored API key. Try again or re-enter the key."
                    )
                );
            });
    };
}

/**
 * Derive a password and store the salt
 * @param password
 * @returns {function(*)}
 */
export function registrationDerivePassword(password) {
    return dispatch => {
        dispatch(registrationLoading());
        dispatch(
            applicationSetStatus("Creating a secure key from your password")
        );

        let salt = false;
        if (store.get(SALT_LOCATION) !== undefined) {
            // we found a salt so we try to use it for deriving the password
            salt = store.get(SALT_LOCATION);
        }

        derivePasswordKey(password, salt, 15000)
            .then(derivedPassword => {
                // DO NOT store the salt here, if the password ends up being wrong we overwrite the salt here!
                dispatch(registrationNotLoading());
                dispatch(registrationSetDerivedPassword(derivedPassword));
            })
            .catch(error => {
                Logger.error(error);
                dispatch(registrationNotLoading());
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
    if (environment !== "PRODUCTION" && environment !== "SANDBOX")
        environment = "SANDBOX";
    return {
        type: "REGISTRATION_SET_ENVIRONMENT",
        payload: {
            environment: environment
        }
    };
}

/**
 * Clear the api key completely uncluding within the bunqjsclient
 * @param BunqJSClient
 * @returns {function(*)}
 */
export function registrationClearApiKey(BunqJSClient) {
    return dispatch => {
        BunqJSClient.destroySession().then(_ => {
            dispatch({
                type: "REGISTRATION_CLEAR_API_KEY"
            });
        });
    };
}

/**
 * Clear the password
 * @param bool resetNoPassword - set to false when something else is going wrong
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
export function registrationSetDerivedPassword(derivedPassword) {
    return {
        type: "REGISTRATION_SET_PASSWORD",
        payload: {
            derivedPassword: derivedPassword
        }
    };
}

/**
 * @returns {function(*)}
 */
export function registrationUseNoPassword() {
    return dispatch => {
        dispatch({
            type: "REGISTRATION_USE_NO_PASSWORD"
        });
        dispatch(registrationDerivePassword("SOME_DEFAULT_PASSWORD"));
    };
}

/**
 * @param password
 * @returns {function(*)}
 */
export function registrationUsePassword(password) {
    return dispatch => {
        dispatch({
            type: "REGISTRATION_USE_PASSWORD"
        });
        dispatch(registrationDerivePassword(password));
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
