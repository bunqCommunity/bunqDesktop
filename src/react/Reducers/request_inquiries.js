import MergeApiObjects from "../Helpers/MergeApiObjects";
import store from "store";

import { STORED_REQUEST_INQUIRIES } from "../Actions/request_inquiries";

export const defaultState = {
    request_inquiries: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let request_inquiries = [...state.request_inquiries];

    switch (action.type) {
        case "REQUEST_INQUIRIES_UPDATE_INFO":
        case "REQUEST_INQUIRIES_SET_INFO":
            // with a set info event or if account id changes we ignore the currently stored items
            const ignoreOldItems =
                action.type === "REQUEST_INQUIRIES_SET_INFO" ||
                state.account_id !== action.payload.account_id;

            const mergedInfo = MergeApiObjects(
                "RequestInquiry",
                action.payload.requestInquiries,
                ignoreOldItems ? [] : request_inquiries
            );

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: mergedInfo.items,
                            account_id: action.payload.account_id
                        },
                        STORED_REQUEST_INQUIRIES
                    )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                request_inquiries: mergedInfo.items,
                account_id: action.payload.account_id,
                newer_id: mergedInfo.newer_id,
                older_id: mergedInfo.older_id
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
        case "REGISTRATION_CLEAR_API_KEY":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(STORED_REQUEST_INQUIRIES);
            return {
                request_inquiries: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
