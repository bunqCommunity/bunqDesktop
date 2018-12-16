import store from "store";
import MergeApiObjects from "../Functions/MergeApiObjects";
import { storeEncryptString } from "../Functions/Crypto/CryptoWorkerWrapper";

import { STORED_BUNQ_ME_TABS } from "../Actions/bunq_me_tabs";

export const defaultState = {
    bunq_me_tabs: [],
    account_id: false,
    loading: false,
    newer_ids: [],
    older_ids: []
};

export default (state = defaultState, action) => {
    let bunq_me_tabs = [...state.bunq_me_tabs];

    switch (action.type) {
        case "BUNQ_ME_TABS_UPDATE_INFO":
        case "BUNQ_ME_TABS_SET_INFO":
            // with a set info event or if account id changes we ignore the currently stored items
            // const ignoreOldItems =
            //     action.type === "BUNQ_ME_TABS_SET_INFO" ||
            //     state.account_id !== action.payload.account_id;
            const ignoreOldItems = false;

            const mergedInfo = MergeApiObjects(
                action.payload.account_id,
                action.payload.bunqMeTabs,
                ignoreOldItems ? [] : bunq_me_tabs
            );

            // limit payments to 1000 in total
            const mergedBunqMeTabs = mergedInfo.items.slice(0, 1000);

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                const BunqDesktopClient = window.BunqDesktopClient;
                BunqDesktopClient.storeEncrypt(
                    {
                        items: mergedBunqMeTabs,
                        account_id: action.payload.account_id
                    },
                    STORED_BUNQ_ME_TABS
                )
                    .then(() => {})
                    .catch(() => {});
            }

            // update newer and older id for this monetary account
            const newerIds = {
                ...state.newer_ids,
                [action.payload.account_id]: mergedInfo.newer_id
            };
            const olderIds = {
                ...state.older_ids,
                [action.payload.account_id]: mergedInfo.older_id
            };

            return {
                ...state,
                bunq_me_tabs: mergedBunqMeTabs,
                account_id: action.payload.account_id,
                newer_ids: newerIds,
                older_ids: olderIds
            };

        case "BUNQ_ME_TABS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "BUNQ_ME_TABS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "BUNQ_ME_TABS_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeRemove(STORED_BUNQ_ME_TABS);
            return {
                bunq_me_tabs: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
