import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import {openSnackbar} from "./snackbar";

export function accountsSetInfo(accounts) {
    return {
        type: "ACCOUNTS_SET_INFO",
        payload: {
            accounts: accounts
        }
    };
}

export function accountsUpdate(BunqJSClient, userId) {
    return dispatch => {
        dispatch(accountsLoading());
        BunqJSClient.api.monetaryAccount
            .list(userId)
            .then(accounts => {
                dispatch(accountsSetInfo(accounts));
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
    return { type: "CREATE_ACCOUNT_IS_LOADING" };
}

export function createAccountNotLoading() {
    return { type: "CREATE_ACCOUNT_IS_NOT_LOADING" };
}

