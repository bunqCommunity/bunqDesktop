const store = require("store");

const accountsDefault =
    store.get("accounts") !== undefined ? store.get("accounts") : [];
const selectedAccountDefault =
    store.get("selected_account") !== undefined
        ? store.get("selected_account")
        : false;

export const defaultState = {
    accounts: accountsDefault,
    selectedAccount: selectedAccountDefault,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "ACCOUNTS_SET_INFO":
            store.set("accounts", action.payload.accounts);
            return {
                ...state,
                accounts: action.payload.accounts
            };

        case "ACCOUNTS_SELECT_ACCOUNT":
            store.set("selected_account", action.payload.selectedAccount);
            return {
                ...state,
                selectedAccount: action.payload.selectedAccount
            };

        case "ACCOUNTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "ACCOUNTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "ACCOUNTS_CLEAR":
            store.remove("accounts");
            store.remove("selected_account");
            return {
                accounts: [],
                selectedAccount: false,
                loading: false
            };
    }
    return state;
};
