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
        BunqJSClient.Session
            .loadEncryptedData(STORED_ACCOUNTS)
            .then(data => {
                if (data && data.items) {
                    // turn plain objects back into MonetaryAccount objects
                    const accountsOld = data.items.map(
                        item => new MonetaryAccount(item)
                    );
                    dispatch(accountsSetInfo(accountsOld, BunqJSClient));
                }
            })
            .catch(error => {});
    };
}

export function accountsUpdate(BunqJSClient, userId) {
    return dispatch => {
        dispatch(accountsLoading());
        BunqJSClient.api.monetaryAccount
            .list(userId)
            .then(accounts => {
                // turn plain objects into MonetaryAccount objects
                const accountsNew = accounts.map(
                    item => new MonetaryAccount(item)
                );

                dispatch(accountsSetInfo(accountsNew, BunqJSClient));
                dispatch(accountsNotLoading());
            })
            .catch(error => {
                dispatch(accountsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load your monetary accounts"
                );
            });
    };
}

export function createAccount(
    BunqJSClient,
    userId,
    currency,
    description,
    dailyLimit,
    color
) {
    return dispatch => {
        dispatch(createAccountLoading());

        const monetaryAccountBankApi = BunqJSClient.api.monetaryAccountBank;

        monetaryAccountBankApi
            .post(userId, currency, description, dailyLimit, color)
            .then(result => {
                dispatch(openSnackbar("Account created successfully!"));
                dispatch(accountsUpdate(BunqJSClient, userId));
                dispatch(createAccountNotLoading());
            })
            .catch(error => {
                dispatch(createAccountNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while creating your account"
                );
            });
    };
}

export function deactivateAccount(BunqJSClient, userId, accountId, reason) {
    return dispatch => {
        dispatch(updateAccountStatusLoading());

        BunqJSClient.api.monetaryAccountBank
            .putCancel(
                userId,
                accountId,
                "CANCELLED",
                "REDEMPTION_VOLUNTARY",
                reason
            )
            .then(result => {
                dispatch(openSnackbar("Account de-activated successfully!"));
                dispatch(accountsUpdate(BunqJSClient, userId));
                dispatch(updateAccountStatusNotLoading());
            })
            .catch(error => {
                dispatch(updateAccountStatusNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while creating your account"
                );
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
