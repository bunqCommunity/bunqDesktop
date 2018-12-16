import store from "store";
import MergeApiObjects from "../Functions/MergeApiObjects";
import { storeEncryptString } from "../Functions/Crypto/CryptoWorkerWrapper";

import { STORED_REQUEST_INQUIRIES } from "../Actions/request_inquiries";

export const defaultState = {
    request_inquiries: [],
    account_id: false,
    loading: false,
    newer_ids: [],
    older_ids: []
};

export default (state = defaultState, action) => {
    let request_inquiries = [...state.request_inquiries];

    switch (action.type) {
        case "REQUEST_INQUIRIES_UPDATE_INFO":
        case "REQUEST_INQUIRIES_SET_INFO":
            // with a set info event or if account id changes we ignore the currently stored items
            // const ignoreOldItems =
            //     action.type === "REQUEST_INQUIRIES_SET_INFO" ||
            //     state.account_id !== action.payload.account_id;
            const ignoreOldItems = false;

            const mergedInfo = MergeApiObjects(
                action.payload.account_id,
                action.payload.requestInquiries,
                ignoreOldItems ? [] : request_inquiries
            );

            // limit payments to 1000 in total
            const mergedRequestInquiries = mergedInfo.items.slice(0, 1000);

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                const BunqDesktopClient = window.BunqDesktopClient;
                BunqDesktopClient.storeEncrypt(
                    {
                        items: mergedRequestInquiries,
                        account_id: action.payload.account_id
                    },
                    STORED_REQUEST_INQUIRIES
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
                request_inquiries: mergedRequestInquiries,
                account_id: action.payload.account_id,
                newer_ids: newerIds,
                older_ids: olderIds
            };

        case "REQUEST_INQUIRIES_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "REQUEST_INQUIRIES_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "REQUEST_INQUIRIES_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeRemove(STORED_REQUEST_INQUIRIES);
            return {
                request_inquiries: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
