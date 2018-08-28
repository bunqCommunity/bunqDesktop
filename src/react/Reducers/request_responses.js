import store from "store";
import MergeApiObjects from "../Helpers/MergeApiObjects";

import { STORED_REQUEST_RESPONSES } from "../Actions/request_responses";

export const defaultState = {
    request_responses: [],
    account_id: false,
    loading: false,
    newer_ids: [],
    older_ids: []
};

export default (state = defaultState, action) => {
    let request_responses = [...state.request_responses];

    switch (action.type) {
        case "REQUEST_RESPONSES_UPDATE_INFO":
        case "REQUEST_RESPONSES_SET_INFO":
            // with a set info event or if account id changes we ignore the currently stored items
            // const ignoreOldItems =
            //     action.type === "REQUEST_RESPONSES_SET_INFO" ||
            //     state.account_id !== action.payload.account_id;
            const ignoreOldItems = false;

            const mergedInfo = MergeApiObjects(
                action.payload.account_id,
                action.payload.requestResponses,
                ignoreOldItems ? [] : request_responses
            );

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session.storeEncryptedData(
                    {
                        items: mergedInfo.items,
                        account_id: action.payload.account_id
                    },
                    STORED_REQUEST_RESPONSES
                )
                    .then(() => {})
                    .catch(() => {});
            }

            // update newer and older id for this monetary account
            const newerIds = {
                ...state.newer_ids,
                [action.payload.account_id]: mergedInfo.newer_id
            }
            const olderIds = {
                ...state.older_ids,
                [action.payload.account_id]: mergedInfo.older_id
            }

            return {
                ...state,
                request_responses: mergedInfo.items,
                account_id: action.payload.account_id,
                newer_ids: newerIds,
                older_ids: olderIds
            };

        case "REQUEST_RESPONSES_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "REQUEST_RESPONSES_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "REQUEST_RESPONSES_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(STORED_REQUEST_RESPONSES);
            return {
                request_responses: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
