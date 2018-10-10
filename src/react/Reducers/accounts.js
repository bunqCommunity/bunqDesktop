import store from "store";
import settings from "../ImportWrappers/electronSettings";

import { STORED_ACCOUNTS } from "../Actions/accounts";

export const SELECTED_ACCOUNT_LOCAION = "BUNQDESKTOP_SELECTED_ACCOUNT";
export const EXCLUDED_ACCOUNT_IDS = "BUNQDESKTOP_EXCLUDED_ACCOUNT_IDS";

const excludedAccountIdsStored = settings.get(EXCLUDED_ACCOUNT_IDS);
const selectedAccountStored = store.get(SELECTED_ACCOUNT_LOCAION);

const selectedAccountDefault = selectedAccountStored !== undefined ? selectedAccountStored : false;
const excludedAccountIdsDefault = excludedAccountIdsStored !== undefined ? excludedAccountIdsStored : [];

export const defaultState = {
    accounts: [],
    loading: false,
    selected_account: selectedAccountDefault,
    excluded_account_ids: excludedAccountIdsDefault
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "ACCOUNTS_SET_INFO":
            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session.storeEncryptedData(
                    {
                        items: action.payload.accounts
                    },
                    STORED_ACCOUNTS
                )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                accounts: action.payload.accounts
            };

        case "ACCOUNTS_SELECT_ACCOUNT":
            store.set(SELECTED_ACCOUNT_LOCAION, action.payload.selectedAccount);
            return {
                ...state,
                selected_account: action.payload.selectedAccount
            };

        case "ACCOUNTS_EXCLUDE_FROM_TOTAL":
            const currentAccountIds = [...state.excluded_account_ids];
            const existingIndex = currentAccountIds.indexOf(action.payload.account_id);

            if (existingIndex === -1) {
                // doesn't exist, add account id to excluded list
                currentAccountIds.push(action.payload.account_id);

                // store in settings
                settings.set(EXCLUDED_ACCOUNT_IDS, currentAccountIds);
            }

            return {
                ...state,
                excluded_account_ids: currentAccountIds
            };
        case "ACCOUNTS_INCLUDE_IN_TOTAL":
            const currentAccountIds2 = [...state.excluded_account_ids];
            const existingIndex2 = currentAccountIds2.indexOf(action.payload.account_id);

            if (existingIndex2 > -1) {
                // exists, remove the id from the excluded list
                currentAccountIds2.splice(existingIndex2, 1);

                // store in settings
                settings.set(EXCLUDED_ACCOUNT_IDS, currentAccountIds2);
            }

            return {
                ...state,
                excluded_account_ids: currentAccountIds2
            };

        case "ACCOUNTS_IS_LOADING":
        case "ACCOUNT_CREATE_IS_LOADING":
        case "ACCOUNT_STATUS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "ACCOUNTS_IS_NOT_LOADING":
        case "ACCOUNT_CREATE_IS_NOT_LOADING":
        case "ACCOUNT_STATUS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "ACCOUNTS_CLEAR":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(SELECTED_ACCOUNT_LOCAION);
            store.remove(STORED_ACCOUNTS);
            return {
                ...state,
                accounts: [],
                selected_account: false,
                loading: false
            };
    }
    return state;
};
