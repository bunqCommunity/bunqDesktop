import MergeApiObjects from "../Helpers/MergeApiObjects";

import { STORED_BUNQ_ME_TABS } from "../Actions/bunq_me_tabs";

export const defaultState = {
    bunq_me_tabs: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let bunq_me_tabs = [...state.bunq_me_tabs];

    switch (action.type) {
        case "BUNQ_ME_TABS_UPDATE_INFO":
        case "BUNQ_ME_TABS_SET_INFO":
            // with a set info event or if account id changes we ignore the currently stored items
            const ignoreOldItems =
                action.type === "BUNQ_ME_TABS_SET_INFO" ||
                state.account_id !== action.payload.account_id;

            const mergedInfo = MergeApiObjects(
                action.payload.bunqMeTabs,
                ignoreOldItems ? [] : bunq_me_tabs
            );

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: mergedInfo.items,
                            account_id: action.payload.account_id
                        },
                        STORED_BUNQ_ME_TABS
                    )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                bunq_me_tabs: mergedInfo.items,
                account_id: action.payload.account_id,
                newer_id: mergedInfo.newer_id,
                older_id: mergedInfo.older_id
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
            return {
                bunq_me_tabs: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
