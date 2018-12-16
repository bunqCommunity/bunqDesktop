import store from "store";
import MergeApiObjects from "../Functions/MergeApiObjects";
import { storeEncryptString } from "../Functions/Crypto/CryptoWorkerWrapper";

import { STORED_REQUEST_INQUIRY_BATCHES } from "../Actions/request_inquiry_batches";

export const defaultState = {
    request_inquiry_batches: [],
    account_id: false,
    loading: false,
    newer_ids: [],
    older_ids: []
};

export default (state = defaultState, action) => {
    let request_inquiry_batches = [...state.request_inquiry_batches];

    switch (action.type) {
        case "REQUEST_INQUIRY_BATCHES_UPDATE_INFO":
        case "REQUEST_INQUIRY_BATCHES_SET_INFO":
            // with a set info event or if account id changes we ignore the currently stored items
            // const ignoreOldItems =
            //     action.type === "REQUEST_INQUIRY_BATCHES_SET_INFO" ||
            //     state.account_id !== action.payload.account_id;
            const ignoreOldItems = false;

            const mergedInfo = MergeApiObjects(
                action.payload.account_id,
                action.payload.requestInquiryBatches,
                ignoreOldItems ? [] : request_inquiry_batches
            );

            // limit payments to 1000 in total
            const mergedRequestBatches = mergedInfo.items.slice(0, 1000);

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                const BunqDesktopClient = window.BunqDesktopClient;
                BunqDesktopClient.storeEncrypt(
                    {
                        items: mergedRequestBatches,
                        account_id: action.payload.account_id
                    },
                    STORED_REQUEST_INQUIRY_BATCHES
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
                request_inquiry_batches: mergedRequestBatches,
                account_id: action.payload.account_id,
                newer_ids: newerIds,
                older_ids: olderIds
            };

        case "REQUEST_INQUIRY_BATCHES_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "REQUEST_INQUIRY_BATCHES_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "REQUEST_INQUIRY_BATCHES_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeRemove(STORED_REQUEST_INQUIRY_BATCHES);
            return {
                request_inquiry_batches: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
