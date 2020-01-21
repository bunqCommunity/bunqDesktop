import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ipcRenderer } from "electron";
import store from "store";
import { AppWindow } from "~app";

import { EXCLUDED_ACCOUNT_IDS, SELECTED_ACCOUNT_LOCATION, STORED_ACCOUNTS } from "~misc/consts";
import { formatMoney } from "~functions/Utils";
import settings from "~importwrappers/electronSettings";
import MonetaryAccount from "~models/MonetaryAccount";
import { IMonetaryAccount } from "~types/MonetaryAccount";

declare let window: AppWindow;

const excludedAccountIdsStored = settings.get(EXCLUDED_ACCOUNT_IDS);
const selectedAccountStored = store.get(SELECTED_ACCOUNT_LOCATION);

const selectedAccountDefault: number | boolean = selectedAccountStored !== undefined ? selectedAccountStored : false;
const excludedAccountIdsDefault: Array<number> = excludedAccountIdsStored !== undefined ? excludedAccountIdsStored : [];

export interface ISetInfoPayload {
    accounts: Array<IMonetaryAccount>;
}

const setInfoAction = createAction("setInfo");
const selectAccountAction = createAction("selectAccount");
const includeInTotalAction = createAction("includeInTotal");
const excludeFromTotalAction = createAction("excludeFromTotal");
const isLoadingAction = createAction("isLoading");
const isNotLoadingAction = createAction("isNotLoading");
const clearAction = createAction("clear");
const createAccountLoadingAction = createAction("createAccountLoading");
const createAccountNotLoadingAction = createAction("createAccountNotLoading");
const updateAccountStatusLoadingAction = createAction("updateAccountStatusLoading");
const updateAccountStatusNotLoadingAction = createAction("updateAccountStatusNotLoading");

// TODO: remove this dependency
function pleaseTurnThisClearFunctionIntoASagaSubscriber(state: IAccountsState) {
    if (window.BunqDesktopClient) {
        window.BunqDesktopClient.storeRemove(SELECTED_ACCOUNT_LOCATION);
        window.BunqDesktopClient.storeRemove(STORED_ACCOUNTS);
    }

    ipcRenderer.send("set-tray-accounts", false);
    ipcRenderer.send("set-tray-balance", false);

    state.accounts = [];
    state.selectedAccount = false;
    state.loading = false;
    state.createLoading = false;
}

export interface IAccountsState {
    accounts: Array<number>;
    loading: boolean;
    createLoading: boolean;
    selectedAccount: number | boolean;
    excludedAccountIds: Array<number>;
}

const initialState = {
    accounts: [],
    loading: false,
    createLoading: false,
    selectedAccount: selectedAccountDefault,
    excludedAccountIds: excludedAccountIdsDefault,
};

const slice = createSlice({
    name: "accounts",
    initialState,
    reducers: {
        [setInfoAction.type](state, action: PayloadAction<ISetInfoPayload>) {
            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeEncrypt({ items: action.payload.accounts }, STORED_ACCOUNTS).then();
            ipcRenderer.send(
                "set-tray-accounts",
                action.payload.accounts
                    .filter(account => {
                        return account && account.status === "ACTIVE";
                    })
                    .map((account) => {
                        return {
                            description: account.description,
                            balance: formatMoney((new MonetaryAccount(account)).getBalance())
                        };
                    })
            );

            state.accounts = action.payload.accounts;
        },
        [selectAccountAction.type](state, action: PayloadAction<number>) {
            store.set(SELECTED_ACCOUNT_LOCATION, action.payload);

            state.selectedAccount = action.payload;
        },
        [includeInTotalAction.type](state, action: PayloadAction<number>) {
            const currentAccountIds2: number[] = [...state.excludedAccountIds];
            const existingIndex2 = currentAccountIds2.indexOf(action.payload);

            if (existingIndex2 > -1) {
                // exists, remove the id from the excluded list
                currentAccountIds2.splice(existingIndex2, 1);

                // store in settings
                settings.set(EXCLUDED_ACCOUNT_IDS, currentAccountIds2);
            }

            state.excludedAccountIds = currentAccountIds2;
        },
        [excludeFromTotalAction.type](state, action: PayloadAction<number>) {
            const currentAccountIds = [...state.excludedAccountIds];
            const existingIndex = currentAccountIds.indexOf(action.payload);

            if (existingIndex === -1) {
                // doesn't exist, add account id to excluded list
                currentAccountIds.push(action.payload);

                // store in settings
                settings.set(EXCLUDED_ACCOUNT_IDS, currentAccountIds);
            }

            state.excludedAccountIds = currentAccountIds;
        },
        [isLoadingAction.type](state) {
            state.loading = true;
        },
        [isNotLoadingAction.type](state) {
            state.loading = false;
        },
        [clearAction.type](state) {
            pleaseTurnThisClearFunctionIntoASagaSubscriber(state);
        },
        [createAccountLoadingAction.type](state) {
            pleaseTurnThisClearFunctionIntoASagaSubscriber(state);
        },
        [createAccountNotLoadingAction.type](state) {
            pleaseTurnThisClearFunctionIntoASagaSubscriber(state);
        },
        [updateAccountStatusLoadingAction.type](state) {
            pleaseTurnThisClearFunctionIntoASagaSubscriber(state);
        },
        [updateAccountStatusNotLoadingAction.type](state) {
            pleaseTurnThisClearFunctionIntoASagaSubscriber(state);
        }
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
