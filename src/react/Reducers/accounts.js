const store = require("store");

export const SELECTED_ACCOUNT_LOCAION = "BUNQDESKTOP_SELECTED_ACCOUNT";

const selectedAccountDefault =
    store.get(SELECTED_ACCOUNT_LOCAION) !== undefined
        ? store.get(SELECTED_ACCOUNT_LOCAION)
        : false;

export const defaultState = {
    accounts: [],
    selectedAccount: selectedAccountDefault,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "ACCOUNTS_SET_INFO":
            return {
                ...state,
                accounts: action.payload.accounts
            };

        case "ACCOUNTS_SELECT_ACCOUNT":
            store.set(SELECTED_ACCOUNT_LOCAION, action.payload.selectedAccount);
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
        case "REGISTRATION_CLEAR_API_KEY":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(SELECTED_ACCOUNT_LOCAION);
            return {
                accounts: [],
                selectedAccount: false,
                loading: false
            };
    }
    return state;
};
