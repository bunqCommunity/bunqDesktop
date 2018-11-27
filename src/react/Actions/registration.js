import store from "store";
import Logger from "../Helpers/Logger";
import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { decryptString, derivePasswordKey, encryptString } from "../Helpers/Crypto";
import { applicationSetStatus } from "./application";
import { openSnackbar } from "./snackbar";
import { userSetInfo } from "./user";
import { loadStoredPayments } from "./payments";
import { loadStoredAccounts } from "./accounts";
import { loadStoredBunqMeTabs } from "./bunq_me_tabs";
import { loadStoredMasterCardActions } from "./master_card_actions";
import { loadStoredRequestInquiries } from "./request_inquiries";
import { loadStoredrequestInquiryBatches } from "./request_inquiry_batches";
import { loadStoredRequestResponses } from "./request_responses";
import { loadStoredContacts } from "./contacts";
import { loadStoredShareInviteBankResponses } from "./share_invite_bank_responses";
import { loadStoredShareInviteBankInquiries } from "./share_invite_bank_inquiries";
import { loadPendingPayments } from "./pending_payments";

/**
 * Logs out of current account and logs back in to the selected stored key
 * @param BunqJSClient
 * @param storedKeyIndex
 * @param derivedPassword
 * @param derivedPasswordIdentifier
 * @returns {Function}
 */
export function registrationSwitchKeys(BunqJSClient, storedKeyIndex, derivedPassword, derivedPasswordIdentifier) {
    return dispatch => {
        dispatch(registrationLogOut(BunqJSClient, false));
        setTimeout(() => {
            dispatch(registrationSetDerivedPassword(derivedPassword, derivedPasswordIdentifier));
            setTimeout(() => {
                dispatch(registrationLoadStoredApiKey(BunqJSClient, storedKeyIndex, derivedPassword));
            }, 1000);
        }, 500);
    };
}

export function registrationLoadStoredData(BunqJSClient) {
    return dispatch => {
        dispatch(loadStoredAccounts(BunqJSClient));
        dispatch(loadStoredContacts(BunqJSClient));
        dispatch(loadPendingPayments(BunqJSClient));
        dispatch(loadStoredPayments(BunqJSClient));
        dispatch(loadStoredBunqMeTabs(BunqJSClient));
        dispatch(loadStoredMasterCardActions(BunqJSClient));
        dispatch(loadStoredRequestInquiries(BunqJSClient));
        dispatch(loadStoredrequestInquiryBatches(BunqJSClient));
        dispatch(loadStoredRequestResponses(BunqJSClient));
        dispatch(loadStoredShareInviteBankResponses(BunqJSClient));
        dispatch(loadStoredShareInviteBankInquiries(BunqJSClient));
    };
}

export function registrationLogin(
    BunqJSClient,
    derivedPassword,
    apiKey = false,
    deviceName,
    environment,
    permittedIps = [],
    checkApiKeyList = true
) {
    return async dispatch => {
        const t = window.t;
        const statusMessage1 = t("Attempting to load your API key");
        const statusMessage2 = t("Registering our encryption keys");
        const statusMessage3 = t("Installing this device");
        const statusMessage4 = t("Creating a new session");
        const failedLoadingMessage = t("We failed to load the stored API key Try again or re-enter the key");

        dispatch(registrationLoading());

        let encryptedApiKey = false;
        if (!apiKey && !!store.get(API_KEY_LOCATION) && !!store.get(API_KEY_IV_LOCATION)) {
            encryptedApiKey = store.get(API_KEY_LOCATION);
            const encryptedApiKeyIV = store.get(API_KEY_IV_LOCATION);

            dispatch(applicationSetStatus(statusMessage1));
            try {
                const decryptedString = await decryptString(encryptedApiKey, derivedPassword.key, encryptedApiKeyIV);
                // validate decrypted result
                if (!decryptedString || decryptedString.length !== 64) {
                    // clear the password so the user can try again
                    dispatch(registrationClearPassword());
                    dispatch(openSnackbar(failedLoadingMessage));
                    Logger.error(`Failed to load API key: with length: ${decryptedString.length}`);

                    return;
                }
                apiKey = decryptedString;
            } catch (exception) {
                // clear the password so the user can try again
                dispatch(registrationResetToApiScreenSoft(BunqJSClient));
                dispatch(registrationNotLoading());
                dispatch(registrationSetNotReady());
                dispatch(openSnackbar(failedLoadingMessage));
                return;
            }

            dispatch(registrationSetApiKeyDirect(apiKey, encryptedApiKey, permittedIps));
        } else {
            dispatch(registrationSetApiKey(apiKey, derivedPassword, permittedIps, checkApiKeyList));
        }

        if (!apiKey) {
            dispatch(registrationNotLoading());
            dispatch(registrationSetNotReady());
            return;
        }

        try {
            await BunqJSClient.run(apiKey, permittedIps, environment, derivedPassword.key);

            if (apiKey === false) {
                // no api key yet so nothing else to do just yet
                return;
            }

            dispatch(applicationSetStatus(statusMessage2));
            await BunqJSClient.install();

            dispatch(applicationSetStatus(statusMessage3));
            await BunqJSClient.registerDevice(deviceName);

            dispatch(applicationSetStatus(statusMessage4));
            await BunqJSClient.registerSession();

            const users = await BunqJSClient.getUsers(true);
            const userType = Object.keys(users)[0];
            dispatch(userSetInfo(users[userType], userType));

            dispatch(registrationLoadStoredData(BunqJSClient));
        } catch (exception) {
            BunqErrorHandler(dispatch, exception, false, BunqJSClient);
            dispatch(registrationResetToApiScreenSoft(BunqJSClient));
            dispatch(registrationNotLoading());
            dispatch(registrationSetNotReady());
            return;
        }

        setTimeout(() => {
            dispatch(applicationSetStatus(""));
            dispatch(registrationNotLoading());
            dispatch(registrationSetReady());
        }, 500);
    };
}

/**
 * Only sets the api key without extra actions
 * @param apiKey
 * @param encryptedApiKey
 * @returns {{type: string, payload: {api_key: *}}}
 */
export function registrationSetApiKeyDirect(apiKey, encryptedApiKey = false, permittedIps = []) {
    return {
        type: "REGISTRATION_SET_API_KEY",
        payload: {
            api_key: apiKey,
            encrypted_api_key: encryptedApiKey,
            permitted_ips: permittedIps
        }
    };
}

/**
 * Stores the api key encrypted in storage
 * @param apiKey
 * @param derivedPassword
 * @param permittedIps
 * @param ensureStorage
 * @returns {function(*)}
 */
export function registrationSetApiKey(apiKey, derivedPassword, permittedIps = [], ensureStorage = true) {
    return dispatch => {
        encryptString(apiKey, derivedPassword.key)
            .then(encrypedData => {
                const encryptedApiKey = encrypedData.encryptedString;
                const encryptedApiKeyIV = encrypedData.iv;

                if (ensureStorage === true) {
                    store.set(API_KEY_LOCATION, encryptedApiKey);
                    store.set(API_KEY_IV_LOCATION, encrypedData.iv);
                    store.set(SALT_LOCATION, derivedPassword.salt);
                    dispatch(registrationEnsureStoredApiKey(encryptedApiKey, encryptedApiKeyIV, permittedIps));
                }

                dispatch(registrationSetApiKeyDirect(apiKey, encryptedApiKey, permittedIps));
            })
            .catch(Logger.error);
    };
}

/**
 * Ensures the stored api_keys contain an encrypted key and iv set
 * @param apiKey
 * @param apiKeyIv
 * @param permittedIps
 * @returns {{type: string, payload: {api_key: *, api_key_iv: *}}}
 */
export function registrationEnsureStoredApiKey(apiKey, apiKeyIv, permittedIps) {
    return {
        type: "REGISTRATION_ENSURE_STORED_API_KEY",
        payload: {
            api_key: apiKey,
            api_key_iv: apiKeyIv,
            permitted_ips: permittedIps
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

                dispatch(registrationSetApiKeyDirect(decryptedString, encryptedApiKey));
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
    return dispatch => {
        const failedMessage = window.t("We failed to load the stored API key Try again or re-enter the key");
        const statusMessage = window.t("Attempting to load your API key");

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
        const encryptedDeviceName = encryptedApiKeyInfo.device_name;
        const encryptedPermittedIps = encryptedApiKeyInfo.permitted_ips;

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

                // nothing changes, just set the api key but do nothing else
                dispatch(
                    registrationLogin(
                        BunqJSClient,
                        derivedPassword,
                        decryptedString,
                        encryptedDeviceName,
                        encryptedEnvironment,
                        encryptedPermittedIps || [],
                        false
                    )
                );
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

export function registrationSetStoredApiKeys(storedApiKeys) {
    return {
        type: "REGISTRATION_SET_STORED_API_KEYS",
        payload: {
            stored_api_keys: storedApiKeys
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
 * @param identifier
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
 * Generic registration ready state
 * @returns {{type: string}}
 */
export function registrationSetReady() {
    return {
        type: "REGISTRATION_READY"
    };
}

/**
 * Generic registration not ready state
 * @returns {{type: string}}
 */
export function registrationSetNotReady() {
    return {
        type: "REGISTRATION_NOT_READY"
    };
}

/**
 * Generic registration loading state
 * @returns {{type: string}}
 */
export function registrationLoading() {
    return {
        type: "REGISTRATION_LOADING"
    };
}

/**
 * Generic registration not loading state
 * @returns {{type: string}}
 */
export function registrationNotLoading() {
    return {
        type: "REGISTRATION_NOT_LOADING"
    };
}
