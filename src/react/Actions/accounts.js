import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import MonetaryAccount from "../Models/MonetaryAccount";

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
        BunqJSClient.Session.loadEncryptedData(STORED_ACCOUNTS)
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

export function createAccount(BunqJSClient, userId, currency, description, dailyLimit, color) {
    const failedMessage = window.t("We received the following error while creating your account");
    const successMessage = window.t("Account created successfully!");

    return dispatch => {
        dispatch(createAccountLoading());

        const monetaryAccountBankApi = BunqJSClient.api.monetaryAccountBank;

        monetaryAccountBankApi
            .post(userId, currency, description, dailyLimit, color)
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

export function accountsDeactivate(BunqJSClient, userId, accountId, reason) {
    const failedMessage = window.t("We received the following error while deactivating your account");
    const successMessage = window.t("Account deactivated successfully!");

    return dispatch => {
        dispatch(updateAccountStatusLoading());

        BunqJSClient.api.monetaryAccountBank
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

export function accountsUpdateSettings(BunqJSClient, userId, accountId, monetaryAccountSettings) {
    const failedMessage = window.t("We received the following error updating the settings for your account");
    const successMessage = window.t("Account settings updated successfully!");

    return dispatch => {
        dispatch(updateAccountStatusLoading());

        BunqJSClient.api.monetaryAccountBank
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

export function accountsLoading() {
    return { type: "ACCOUNTS_IS_LOADING" };
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
