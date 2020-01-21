import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppWindow } from "~app";

import { STORED_BUNQ_ME_TABS } from "~misc/consts";
import BunqDesktopClient from "~components/BunqDesktopClient";
import MergeApiObjects from "~functions/MergeApiObjects";

declare let window: AppWindow;

interface ISetInfoPayload {
    BunqJSClient?: boolean;
    resetOldItems?: boolean;
    bunqMeTabs?: any[];
    account_id: string;
}

const setInfoAction = createAction("setInfo", (
    {
        BunqJSClient = false,
        resetOldItems = false,
        bunqMeTabs = [],
        account_id,
    }: ISetInfoPayload) => ({ payload: { resetOldItems, bunqMeTabs, account_id } }));
const isLoadingAction = createAction("isLoading");
const isNotLoadingAction = createAction("isNotLoading");
const clearAction = createAction("clear");

interface IBunqMeTabsState {
    bunq_me_tabs: number[];
    account_id: string;
    loading: boolean;
    newer_ids: number[];
    older_ids: number[];
}

const initialState: IBunqMeTabsState = {
    bunq_me_tabs: [],
    account_id: "",
    loading: false,
    newer_ids: [],
    older_ids: [],
};

// TODO: remove this dependency
function pleaseTurnThisClearFunctionIntoASagaSubcriber(state) {
    const BunqDesktopClient = window.BunqDesktopClient;
    BunqDesktopClient.storeRemove(STORED_BUNQ_ME_TABS);

    state.bunq_me_tabs = [];
    state.account_id = false;
    state.loading = false;
}

const slice = createSlice({
    name: "bunqMeTabs",
    initialState,
    reducers: {
        [isLoadingAction.type](state) {
            state.loading = true;
        },
        [isNotLoadingAction.type](state) {
            state.loading = false;
        },
        [setInfoAction.type](state, action: PayloadAction<ISetInfoPayload>) {
            // with a set info event or if account id changes we ignore the currently stored items
            // const ignoreOldItems =
            //     action.type === "BUNQ_ME_TABS_SET_INFO" ||
            //     state.account_id !== action.payload.account_id;
            const ignoreOldItems = action.payload.resetOldItems;

            const mergedInfo = MergeApiObjects(
                action.payload.account_id,
                action.payload.bunqMeTabs,
                ignoreOldItems ? [] : state.bunq_me_tabs
            );

            // limit payments to 1000 in total
            const mergedBunqMeTabs = mergedInfo.items.slice(0, 1000);

            window.BunqDesktopClient.storeEncrypt(
                {
                    items: mergedBunqMeTabs,
                    account_id: action.payload.account_id
                },
                STORED_BUNQ_ME_TABS
            ).then();

            // update newer and older id for this monetary account
            const newerIds = {
                ...state.newer_ids,
                [action.payload.account_id]: mergedInfo.newer_id
            };
            const olderIds = {
                ...state.older_ids,
                [action.payload.account_id]: mergedInfo.older_id
            };

            state.bunq_me_tabs = mergedBunqMeTabs;
            state.account_id = action.payload.account_id;
            state.newer_ids = newerIds;
            state.older_ids = olderIds;
        },
        ["REGISTRATION_LOG_OUT"](state) {
            // TODO: turn into a saga subscriber
            pleaseTurnThisClearFunctionIntoASagaSubcriber(state);
        },
        ["REGISTRATION_CLEAR_PRIVATE_DATA"](state) {
            // TODO: turn into a saga subscriber
            pleaseTurnThisClearFunctionIntoASagaSubcriber(state);
        },
        ["REGISTRATION_CLEAR_USER_INFO"](state) {
            // TODO: turn into a saga subscriber
            pleaseTurnThisClearFunctionIntoASagaSubcriber(state);
        },
        [clearAction.type](state) {
            // TODO: turn into a saga subscriber
            pleaseTurnThisClearFunctionIntoASagaSubcriber(state);
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
