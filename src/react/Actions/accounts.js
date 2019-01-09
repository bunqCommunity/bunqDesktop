import BunqErrorHandler from "../Functions/BunqErrorHandler";
import MonetaryAccount from "../Models/MonetaryAccount";

import { openSnackbar } from "./snackbar";

export const STORED_ACCOUNTS = "BUNQDESKTOP_STORED_ACCOUNTS";

export function accountsSetInfo(accounts, BunqJSClient = false) {
    return {
        type: "ACCOUNTS_SET_INFO",
        payload: {
            accounts: accounts,
            BunqJSClient
        }
    };
}

export function loadStoredAccounts(BunqJSClient) {
    return dispatch => {
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(STORED_ACCOUNTS)
            .then(data => {
                if (data && data.items) {
                    // turn plain objects back into MonetaryAccount objects
                    const accountsOld = data.items.map(item => new MonetaryAccount(item));
                    dispatch(accountsSetInfo(accountsOld, BunqJSClient));
                }
            })
            .catch(error => {});
    };
}

export function accountsUpdate(BunqJSClient, userId) {
    const failedMessage = window.t("We failed to load your monetary accounts");

    return dispatch => {
        dispatch(accountsLoading());
        BunqJSClient.api.monetaryAccount
            .list(userId)
            .then(accounts => {
                // turn plain objects into MonetaryAccount objects
                const accountsNew = accounts.map(item => new MonetaryAccount(item));

                dispatch(accountsSetInfo(accountsNew, BunqJSClient));
                dispatch(accountsNotLoading());
            })
            .catch(error => {
                dispatch(accountsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function createAccount(
    BunqJSClient,
    userId,
    currency,
    description,
    dailyLimit,
    color,
    savingsGoal = false,
    accountType = "MonetaryAccountBank"
) {
    const failedMessage = window.t("We received the following error while creating your account");
    const successMessage = window.t("Account created successfully!");

    return dispatch => {
        dispatch(createAccountLoading());

        let apiPromise;
        switch (accountType) {
            case "MonetaryAccountSavings":
                apiPromise = BunqJSClient.api.monetaryAccountSavings.post(
                    userId,
                    currency,
                    description,
                    dailyLimit,
                    color,
                    savingsGoal
                );
                break;
            case "MonetaryAccountJoint":
                apiPromise = BunqJSClient.api.monetaryAccountJoint.post(
                    userId,
                    currency,
                    description,
                    dailyLimit,
                    color
                );
                break;
            case "MonetaryAccountBank":
            default:
                apiPromise = BunqJSClient.api.monetaryAccountBank.post(
                    userId,
                    currency,
                    description,
                    dailyLimit,
                    color
                );
                break;
        }

        apiPromise
            .then(result => {
                dispatch(openSnackbar(successMessage));
                dispatch(accountsUpdate(BunqJSClient, userId));
                dispatch(createAccountNotLoading());
            })
            .catch(error => {
                dispatch(createAccountNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function accountsUpdateImage(
    BunqJSClient,
    userId,
    accountId,
    attachmentId,
    accountType = "MonetaryAccountBank"
) {
    const failedMessage = window.t("We received the following error while updating the image for the monetary account");
    const successMessage = window.t("Image updated successfully!");

    return dispatch => {
        dispatch(accountsLoading());

        // make the image public
        BunqJSClient.api.avatar
            .post(attachmentId)
            .then(avatarUuid => {
                const putRequest = {
                    avatar_uuid: avatarUuid
                };

                let apiPromise;
                switch (accountType) {
                    case "MonetaryAccountSavings":
                        apiPromise = BunqJSClient.api.monetaryAccountSavings.put(userId, accountId, putRequest);
                        break;
                    case "MonetaryAccountJoint":
                        apiPromise = BunqJSClient.api.monetaryAccountJoint.put(userId, accountId, putRequest);
                        break;
                    case "MonetaryAccountBank":
                    default:
                        apiPromise = BunqJSClient.api.monetaryAccountBank.put(userId, accountId, putRequest);
                        break;
                }

                apiPromise
                    .then(result => {
                        dispatch(openSnackbar(successMessage));
                        dispatch(accountsUpdate(BunqJSClient, userId));
                        dispatch(accountsNotLoading());
                    })
                    .catch(error => {
                        dispatch(accountsNotLoading());
                        BunqErrorHandler(dispatch, error, failedMessage);
                    });
            })
            .catch(error => {
                dispatch(accountsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function accountsDeactivate(BunqJSClient, userId, accountId, reason, accountType = "MonetaryAccountBank") {
    const failedMessage = window.t("We received the following error while deactivating your account");
    const successMessage = window.t("Account deactivated successfully!");

    return dispatch => {
        dispatch(updateAccountStatusLoading());

        let apiHandler = null;
        switch (accountType) {
            case "MonetaryAccountSavings":
                apiHandler = BunqJSClient.api.monetaryAccountSavings;
                break;
            case "MonetaryAccountJoint":
                apiHandler = BunqJSClient.api.monetaryAccountJoint;
                break;
            case "MonetaryAccountBank":
            default:
                apiHandler = BunqJSClient.api.monetaryAccountBank;
                break;
        }

        apiHandler
            .putCancel(userId, accountId, "CANCELLED", "REDEMPTION_VOLUNTARY", reason)
            .then(result => {
                dispatch(openSnackbar(successMessage));
                dispatch(accountsUpdate(BunqJSClient, userId));
                dispatch(updateAccountStatusNotLoading());
            })
            .catch(error => {
                dispatch(updateAccountStatusNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function accountsUpdateSettings(
    BunqJSClient,
    userId,
    accountId,
    monetaryAccountSettings,
    accountType = "MonetaryAccountBank"
) {
    const failedMessage = window.t("We received the following error updating the settings for your account");
    const successMessage = window.t("Account settings updated successfully!");

    return dispatch => {
        dispatch(updateAccountStatusLoading());

        let apiHandler = null;
        switch (accountType) {
            case "MonetaryAccountSavings":
                apiHandler = BunqJSClient.api.monetaryAccountSavings;
                break;
            case "MonetaryAccountJoint":
                apiHandler = BunqJSClient.api.monetaryAccountJoint;
                break;
            case "MonetaryAccountBank":
            default:
                apiHandler = BunqJSClient.api.monetaryAccountBank;
                break;
        }

        apiHandler
            .put(userId, accountId, monetaryAccountSettings)
            .then(result => {
                dispatch(openSnackbar(successMessage));
                dispatch(accountsUpdate(BunqJSClient, userId));
                dispatch(updateAccountStatusNotLoading());
            })
            .catch(error => {
                dispatch(updateAccountStatusNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function accountsSelectAccount(account_id) {
    return {
        type: "ACCOUNTS_SELECT_ACCOUNT",
        payload: {
            selectedAccount: account_id
        }
    };
}

export function accountExcludeFromTotal(accountId) {
    return {
        type: "ACCOUNTS_EXCLUDE_FROM_TOTAL",
        payload: {
            account_id: accountId
        }
    };
}
export function accountIncludeInTotal(accountId) {
    return {
        type: "ACCOUNTS_INCLUDE_IN_TOTAL",
        payload: {
            account_id: accountId
        }
    };
}

export function accountsLoading() {
    return { type: "ACCOUNTS_IS_LOADING" };
}
export function accountsNotLoading() {
    return { type: "ACCOUNTS_IS_NOT_LOADING" };
}

export function accountsClear() {
    return { type: "ACCOUNTS_CLEAR" };
}

export function createAccountLoading() {
    return { type: "ACCOUNT_CREATE_IS_LOADING" };
}
export function createAccountNotLoading() {
    return { type: "ACCOUNT_CREATE_IS_NOT_LOADING" };
}

export function updateAccountStatusLoading() {
    return { type: "ACCOUNT_STATUS_IS_LOADING" };
}
export function updateAccountStatusNotLoading() {
    return { type: "ACCOUNT_STATUS_IS_NOT_LOADING" };
}
