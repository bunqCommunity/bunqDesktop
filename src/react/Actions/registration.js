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
        dispatch(registrationLogOut(false));
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
    apiKey = false,
    deviceName = false,
    environment = false,
    permittedIps = []
) {
    console.log(apiKey, deviceName, environment, permittedIps);

    const BunqDesktopClient = window.BunqDesktopClient;
    const t = window.t;
    return async dispatch => {
        const statusMessage2 = t("Registering our encryption keys");
        const statusMessage3 = t("Installing this device");
        const statusMessage4 = t("Creating a new session");
        const statusMessage = t("Attempting to load your API key");

        console.count("registrationLogin");

        dispatch(registrationLoading());

        if (!apiKey) {
            console.log(2);
            dispatch(applicationSetStatus(statusMessage));
            if (BunqDesktopClient.derivedPassword) {
                console.log(3);
                try {
                    const hasStoredApiKey = await BunqDesktopClient.loadApiKey();
                    console.log(4, hasStoredApiKey);
                    if (!hasStoredApiKey) {
                        console.log(5);
                        // no given key and no stored key
                        dispatch(registrationNotLoading());

                        // TODO this requires logic when a key is st

                        // dispatch(registrationResetToApiScreenSoft());
                        dispatch(registrationSetNotReady());
                        return;
                    }
                    apiKey = hasStoredApiKey;
                } catch (exception) {
                    console.error(5, "ex", exception);
                    dispatch(registrationResetToApiScreenSoft());
                    dispatch(registrationNotLoading());
                    dispatch(registrationSetNotReady());
                    return;
                }
            } else {
                console.log(6);
                dispatch(registrationNotLoading());
                dispatch(registrationSetNotReady());
                return;
            }

            console.log(7);

            // set the loaded data in registration storage
        } else {
            console.log(8);
            await BunqDesktopClient.setupNewApiKey(apiKey, deviceName, environment, permittedIps);
        }

        try {
            console.log(9);
            await BunqDesktopClient.BunqJSClientRun();

            dispatch(applicationSetStatus(statusMessage2));
            await BunqDesktopClient.BunqJSClientInstall();

            dispatch(applicationSetStatus(statusMessage3));
            await BunqDesktopClient.BunqJSClientRegisterDevice();

            dispatch(applicationSetStatus(statusMessage4));
            await BunqDesktopClient.BunqJSClientRegisterSession();

            const users = await BunqDesktopClient.BunqJSClientRegisterGetUsers();
            const userType = Object.keys(users)[0];
            dispatch(userSetInfo(users[userType], userType));

            // load bunq api data and other data like contacts from storage
            dispatch(registrationLoadStoredData(BunqJSClient));
        } catch (exception) {
            console.error(exception);
            BunqErrorHandler(dispatch, exception, false, BunqJSClient);
            dispatch(registrationResetToApiScreenSoft(BunqJSClient));
            dispatch(registrationNotLoading());
            dispatch(registrationSetNotReady());
            return;
        }

        setTimeout(() => {
            dispatch(applicationSetStatus(""));
            dispatch(registrationNotLoading());
            dispatch(registrationSetBunqDesktopClientData());
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
 * Log out without removing the stored apikey and password
 * and keep the api Installation and Device installation
 * @returns {function(*)}
 */
export function registrationResetToApiScreenSoft() {
    const BunqDesktopClient = window.BunqDesktopClient;
    return dispatch => {
        BunqDesktopClient.destroyApiSession(true).then(_ => {
            dispatch({
                type: "REGISTRATION_RESET_TO_API_SCREEN"
            });
        });
    };
}

/**
 * Log out without removing the stored apikey
 * @param resetPassword
 * @returns {function(*)}
 */
export function registrationLogOut(resetPassword = false) {
    const BunqDesktopClient = window.BunqDesktopClient;
    return dispatch => {
        BunqDesktopClient.destroyApiSession().then(_ => {
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
 * @param resetPassword
 * @returns {function(*)}
 */
export function registrationClearPrivateData() {
    const BunqDesktopClient = window.BunqDesktopClient;
    return dispatch => {
        BunqDesktopClient.destroySession().then(_ => {
            dispatch({
                type: "REGISTRATION_CLEAR_PRIVATE_DATA"
            });
        });
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

export const registrationNEWLoadApiKey = () => {
    const BunqDesktopClient = window.BunqDesktopClient;
    const t = window.t;
    const statusMessage1 = t("Attempting to load your API key");
    const failedLoadingMessage = t("We failed to load the stored API key Try again or re-enter the key");

    return dispatch => {
        dispatch(registrationLoading());
        dispatch(applicationSetStatus(statusMessage1));
        BunqDesktopClient.loadApiKey()
            .then(done => {
                dispatch(registrationNotLoading());
                console.log("Done loadApiKey", done);
            })
            .catch(error => {
                console.error("Error loadApiKey", error);

                dispatch(registrationNotLoading());
                dispatch(registrationResetToApiScreenSoft());
                dispatch(registrationSetNotReady());
                dispatch(openSnackbar(failedLoadingMessage));
            });
    };
};

// export const registrationNEWSwitchStoredApiKey = keyIndex => {
//     const BunqDesktopClient = window.BunqDesktopClient;
//     const t = window.t;
//     const statusMessage = t("Attempting to load your API key");
//     const failedLoadingMessage = t("We failed to load the stored API key Try again or re-enter the key");
//
//     return dispatch => {
//         dispatch(registrationLoading());
//         dispatch(applicationSetStatus(statusMessage));
//         BunqDesktopClient.switchStoredApiKey(keyIndex)
//             .then(done => {
//                 dispatch(registrationNotLoading());
//                 console.log("Done switchStoredApiKey", done);
//             })
//             .catch(error => {
//                 dispatch(registrationNotLoading());
//                 console.error("Error switchStoredApiKey", error);
//
//                 dispatch(registrationNotLoading());
//                 dispatch(registrationResetToApiScreenSoft());
//                 dispatch(registrationSetNotReady());
//                 dispatch(openSnackbar(failedLoadingMessage));
//             });
//     };
// };

export const registrationNEWSetPassword = password => {
    const BunqDesktopClient = window.BunqDesktopClient;
    const t = window.t;
    // TODO password error message
    // const failedLoadingMessage = t("Failed to set hte password");

    return dispatch => {
        dispatch(registrationLoading());
        BunqDesktopClient.setupPassword(password)
            .then(done => {
                dispatch(registrationNotLoading());
                dispatch(registrationSetBunqDesktopClientData());
                console.log("Done setupPassword", done);
            })
            .catch(error => {
                console.error("Error setupPassword", error);

                dispatch(registrationNotLoading());
                dispatch(registrationResetToApiScreenSoft());
                dispatch(registrationSetNotReady());
                // dispatch(openSnackbar(failedLoadingMessage));
            });
    };
};

export const registrationSkipPassword = () => {
    const BunqDesktopClient = window.BunqDesktopClient;
    return dispatch => {
        dispatch(registrationLoading());
        BunqDesktopClient.skipPassword()
            .then(done => {
                dispatch(registrationNotLoading());
                dispatch(registrationSetBunqDesktopClientData());
                console.log("Done skipPassword", done);
            })
            .catch(error => {
                dispatch(registrationNotLoading());
                console.error("Error skipPassword", error);
            });
    };
};

export const registrationSetBunqDesktopClientData = () => {
    const BunqDesktopClient = window.BunqDesktopClient;
    return {
        type: "REGISTRATION_SET_BUNQ_DESKTOP_CLIENT_DATA",
        payload: {
            derived_password: BunqDesktopClient.derivedPassword,
            derived_password_salt: BunqDesktopClient.derivedPasswordSalt,
            identifier: BunqDesktopClient.passwordIdentifier,

            api_key: BunqDesktopClient.apiKey,
            encrypted_api_key: BunqDesktopClient.encryptedApiKey,
            encrypted_api_key_iv: BunqDesktopClient.encryptedApiKeyIv,
            device_name: BunqDesktopClient.deviceName,
            environment: BunqDesktopClient.environment,
            permitted_ips: BunqDesktopClient.permittedIps,

            has_stored_api_key: BunqDesktopClient.hasStoredApiKey,
            stored_api_keys: BunqDesktopClient.storedApiKeys,
            use_no_password: BunqDesktopClient.hasSkippedPassword
        }
    };
};
