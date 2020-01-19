import BunqErrorHandler from "../Functions/BunqErrorHandler";
import { applicationSetStatus } from "./application";
import { userSetInfo } from "./user";
import { loadStoredPayments } from "./payments";
import { loadStoredAccounts } from "./accounts";
import { loadStoredBunqMeTabs } from "./bunq_me_tabs";
import { loadStoredMasterCardActions } from "./master_card_actions";
import { loadStoredRequestInquiries } from "./request_inquiries";
import { loadStoredrequestInquiryBatches } from "./request_inquiry_batches";
import { loadStoredRequestResponses } from "./request_responses";
import { loadStoredContacts } from "./contacts";
import { loadStoredShareInviteMonetaryAccountResponses } from "./share_invite_monetary_account_responses";
import { loadStoredShareInviteBankInquiries } from "./share_invite_monetary_account_inquiries";
import { loadPendingPayments } from "./pending_payments";
import { openSnackbar } from "./snackbar";

/**
 * Logs out of current account and logs back in to the selected stored key
 * @param storedKeyIndex
 * @returns {Function}
 */
export function registrationSwitchKeys(storedKeyIndex) {
    return dispatch => {
        dispatch(registrationLoading());
        dispatch(registrationSetNotReady());
        dispatch(registrationClearUserInfo());

        setTimeout(() => {
            dispatch(registrationResetToApiScreen(true));
            setTimeout(() => {
                dispatch(registrationSwitchStoredApiKey(storedKeyIndex));
            }, 1000);
        }, 100);
    };
}

export function registrationLogin(apiKey = false, deviceName = false, environment = false, permittedIps = []) {
    const BunqDesktopClient = window.BunqDesktopClient;
    const BunqJSClient = BunqDesktopClient.BunqJSClient;
    const t = window.t;

    return async dispatch => {
        const statusMessage2 = t("Registering our encryption keys");
        const statusMessage3 = t("Installing this device");
        const statusMessage4 = t("Creating a new session");
        const statusMessage = t("Attempting to load your API key");

        const failedToDecryptDataMessage = t("Failed to decrypt the stored data using the given password");

        dispatch(registrationLoading());

        if (!apiKey) {
            dispatch(applicationSetStatus(statusMessage));
            if (BunqDesktopClient.derivedPassword) {
                try {
                    const hasStoredApiKey = await BunqDesktopClient.loadApiKey();
                    if (!hasStoredApiKey) {
                        // no given key and no stored key
                        dispatch(registrationNotLoading());
                        dispatch(registrationSetNotReady());
                        return;
                    }
                    apiKey = hasStoredApiKey;
                } catch (exception) {
                    BunqDesktopClient.Logger.error(exception);
                    dispatch(openSnackbar(failedToDecryptDataMessage));
                    dispatch(registrationLogOut(false));
                    dispatch(registrationNotLoading());
                    dispatch(registrationSetNotReady());
                    return;
                }
            } else {
                dispatch(registrationNotLoading());
                dispatch(registrationSetNotReady());
                return;
            }

            // set the loaded data in registration storage
        } else {
            await BunqDesktopClient.setupNewApiKey(apiKey, deviceName, environment, permittedIps);
        }

        try {
            await BunqDesktopClient.BunqJSClientRun();

            dispatch(applicationSetStatus(statusMessage2));
            await BunqDesktopClient.BunqJSClientInstall();

            dispatch(applicationSetStatus(statusMessage3));
            await BunqDesktopClient.BunqJSClientRegisterDevice();

            dispatch(applicationSetStatus(statusMessage4));
            await BunqDesktopClient.BunqJSClientRegisterSession();

            const users = await BunqDesktopClient.BunqJSClientGetUsers();
            const userType = Object.keys(users)[0];
            dispatch(userSetInfo(users[userType], userType));

            // load bunq api data and other data like contacts from storage
            dispatch(registrationLoadStoredData());
        } catch (exception) {
            BunqErrorHandler(dispatch, exception, false, BunqJSClient);
            dispatch(registrationResetToApiScreen());
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
 * Logs out the current data and start the login process when done
 * @param keyIndex
 * @returns {Function}
 */
export const registrationSwitchStoredApiKey = keyIndex => {
    const BunqDesktopClient = window.BunqDesktopClient;
    const failureMessage = window.t("Something went wrong while trying to switch stored API keys");

    return dispatch => {
        dispatch(registrationLoading());
        BunqDesktopClient.switchStoredApiKey(keyIndex)
            .then(done => {
                dispatch(registrationLogin());
            })
            .catch(error => {
                BunqDesktopClient.Logger.error("switchStoredApiKey");
                BunqDesktopClient.Logger.error(error);
                dispatch(registrationNotLoading());
                dispatch(openSnackbar(failureMessage));
            });
    };
};

/**
 * Attempts to login using a given password
 * @param password
 * @returns {Function}
 */
export const registrationSetPassword = password => {
    const BunqDesktopClient = window.BunqDesktopClient;
    const failureMessage = window.t("Something went wrong while trying to setup your password");

    return dispatch => {
        dispatch(registrationLoading());
        BunqDesktopClient.setupPassword(password)
            .then(done => {
                dispatch(registrationNotLoading());
                dispatch(registrationSetBunqDesktopClientData());
            })
            .catch(error => {
                BunqDesktopClient.Logger.error("setupPassword");
                BunqDesktopClient.Logger.error(error);
                dispatch(registrationNotLoading());
                dispatch(openSnackbar(failureMessage));
            });
    };
};

/**
 * Logs in with the default password while using the standard login steps
 * @returns {Function}
 */
export const registrationSkipPassword = () => {
    const BunqDesktopClient = window.BunqDesktopClient;
    const failureMessage = window.t("Something went wrong while trying to set the default password");

    return dispatch => {
        dispatch(registrationLoading());
        BunqDesktopClient.skipPassword()
            .then(done => {
                dispatch(registrationNotLoading());
                dispatch(registrationSetBunqDesktopClientData());
            })
            .catch(error => {
                BunqDesktopClient.Logger.error("skipPassword");
                BunqDesktopClient.Logger.error(error);
                dispatch(registrationNotLoading());
                dispatch(openSnackbar(failureMessage));
            });
    };
};

/**
 * Changes the password and encrypts all data using the new password
 * @returns {Function}
 */
export const registrationChangePassword = newPassword => {
    const BunqDesktopClient = window.BunqDesktopClient;
    const failureMessage = window.t("Something went wrong while trying update your password");
    const successMessage = window.t("Your password has been updated");

    return dispatch => {
        dispatch(registrationLoading());
        BunqDesktopClient.changePassword(newPassword)
            .then(done => {
                dispatch(registrationNotLoading());
                dispatch(registrationSetBunqDesktopClientData());
                dispatch(openSnackbar(successMessage));
            })
            .catch(error => {
                BunqDesktopClient.Logger.error("changePassword");
                BunqDesktopClient.Logger.error(error);
                dispatch(registrationNotLoading());
                dispatch(openSnackbar(failureMessage));
            });
    };
};

/**
 * Removes a stored api key
 * @param index
 * @returns {{type: string, payload: {index: *}}}
 */
export function registrationRemoveStoredApiKey(index) {
    const BunqDesktopClient = window.BunqDesktopClient;

    BunqDesktopClient.removeStoredApiKey(index);
    return {
        type: "REGISTRATION_REMOVE_STORED_API_KEY",
        payload: {
            stored_api_keys: BunqDesktopClient.storedApiKeys
        }
    };
}

/**
 * Sets the stored api keys list
 * @param storedApiKeys
 * @returns {{type: string, payload: {stored_api_keys: StoredApiKey[]}}}
 */
export function registrationSetStoredApiKeys(storedApiKeys) {
    const BunqDesktopClient = window.BunqDesktopClient;

    BunqDesktopClient.setStoredApiKeys(storedApiKeys);
    return {
        type: "REGISTRATION_SET_STORED_API_KEYS",
        payload: {
            stored_api_keys: BunqDesktopClient.storedApiKeys
        }
    };
}

/**
 * Returns the client back to Login page
 * @param {boolean} resetStoredApiKey
 * @returns {function(*)}
 */
export function registrationResetToApiScreen(resetStoredApiKey = false) {
    const BunqDesktopClient = window.BunqDesktopClient;
    return dispatch => {
        BunqDesktopClient.destroyApiSession(resetStoredApiKey).then(_ => {
            dispatch({
                type: "REGISTRATION_RESET_TO_API_SCREEN"
            });
        });
    };
}

/**
 * Log out without removing the stored apikey and go back to password screen
 * @param resetPassword
 * @returns {function(*)}
 */
export function registrationLogOut(resetStoredApiKey = true) {
    const BunqDesktopClient = window.BunqDesktopClient;
    return dispatch => {
        BunqDesktopClient.clearPassword();
        BunqDesktopClient.destroyApiSession(resetStoredApiKey).then(_ => {
            dispatch({
                type: "REGISTRATION_LOG_OUT",
                payload: {
                    reset_stored_api_key: resetStoredApiKey
                }
            });
        });
    };
}

/**
 * Remove all api keys, passwords and other private data
 * @returns {function(*)}
 */
export function registrationClearPrivateData() {
    const BunqDesktopClient = window.BunqDesktopClient;
    return dispatch => {
        BunqDesktopClient.clearPassword(true);
        BunqDesktopClient.clearStoredApiKeys();
        BunqDesktopClient.destroySession().then(_ => {
            dispatch({
                type: "REGISTRATION_CLEAR_PRIVATE_DATA"
            });
        });
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

export function registrationLoadStoredData() {
    const BunqDesktopClient = window.BunqDesktopClient;
    const BunqJSClient = BunqDesktopClient.BunqJSClient;
    return dispatch => {
        // skip if no apiKey is set
        if (!BunqDesktopClient.apiKey) return;

        dispatch(loadStoredAccounts(BunqJSClient));
        dispatch(loadStoredContacts(BunqJSClient));
        dispatch(loadPendingPayments(BunqJSClient));
        dispatch(loadStoredPayments(BunqJSClient));
        dispatch(loadStoredBunqMeTabs(BunqJSClient));
        dispatch(loadStoredMasterCardActions(BunqJSClient));
        dispatch(loadStoredRequestInquiries(BunqJSClient));
        dispatch(loadStoredrequestInquiryBatches(BunqJSClient));
        dispatch(loadStoredRequestResponses(BunqJSClient));
        dispatch(loadStoredShareInviteMonetaryAccountResponses(BunqJSClient));
        dispatch(loadStoredShareInviteBankInquiries(BunqJSClient));
    };
}

/**
 * syncs bunqdesktopclient data to the registration reducer
 */
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
