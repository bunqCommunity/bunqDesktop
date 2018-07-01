import MergeApiObjects from "../Helpers/MergeApiObjects";

import { STORED_PAYMENTS } from "../Actions/payments";

export const defaultState = {
    payments: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let payments = [...state.payments];

    switch (action.type) {
        case "PAYMENTS_UPDATE_INFO":
        case "PAYMENTS_SET_INFO":
            // with a set info event or if account id changes we ignore the currently stored items
            const ignoreOldItems =
                action.type === "PAYMENTS_SET_INFO" ||
                state.account_id !== action.payload.account_id;

            const mergedInfo = MergeApiObjects(
                action.payload.payments,
                ignoreOldItems ? [] : payments
            );

            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: mergedInfo.items,
                            account_id: action.payload.account_id
                        },
                        STORED_PAYMENTS
                    )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                payments: mergedInfo.items,
                account_id: action.payload.account_id,
                newer_id: mergedInfo.newer_id,
                older_id: mergedInfo.older_id
            };

        case "PAYMENTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "PAYMENTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "PAYMENTS_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                payments: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
