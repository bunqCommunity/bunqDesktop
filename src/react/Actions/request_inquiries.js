const Logger = require("../Helpers/Logger");
import { openModal } from "./modal";

export function requestInquiriesSetInfo(requestInquiries, account_id) {
    // return the action
    return {
        type: "REQUEST_INQUIRIES_SET_INFO",
        payload: {
            requestInquiries: requestInquiries,
            account_id: account_id
        }
    };
}

export function requestInquiriesUpdate(BunqJSClient, user_id, account_id) {
    return dispatch => {
        dispatch(requestInquiriesLoading());
        BunqJSClient.api.payment
            .list(user_id, account_id)
            .then(requestInquiries => {
                dispatch(requestInquiriesSetInfo(requestInquiries, account_id));
                dispatch(requestInquiriesNotLoading());
            })
            .catch(err => {
                Logger.error(err);
                dispatch(
                    openModal(
                        "We failed to load the requestInquiries for this monetary account",
                        "Something went wrong"
                    )
                );
                dispatch(requestInquiriesNotLoading());
            });
    };
}

export function requestInquiriesLoading() {
    return { type: "REQUEST_INQUIRIES_IS_LOADING" };
}

export function requestInquiriesNotLoading() {
    return { type: "REQUEST_INQUIRIES_IS_NOT_LOADING" };
}

export function requestInquiriesClear() {
    return { type: "REQUEST_INQUIRIES_CLEAR" };
}
