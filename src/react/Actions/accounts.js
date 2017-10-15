import axios from "axios";
import Utils from "../Helpers/Utils";
const Logger = require("../Helpers/Logger");

export function accountsSetInfo(accounts) {
    return {
        type: "ACCOUNTS_SET_INFO",
        payload: {
            accounts: accounts
        }
    };
}

export function accountsUpdate() {
    return dispatch => {
        Logger.error("accounts api not implemented");
        // dispatch(accountsLoading());
        // axios
        //     .get(`/api/accounts`)
        //     .then(response => response.data)
        //     .then(json => {
        //         if (Utils.validateJSON(json)) {
        //             dispatch(accountsSetInfo(json));
        //         }
        //         dispatch(accountsNotLoading());
        //     })
        //     .catch(err => {
        //         Logger.trace(err);
        //         dispatch(accountsNotLoading());
        //     });
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
