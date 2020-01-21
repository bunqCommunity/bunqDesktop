import BunqErrorHandler from "~functions/BunqErrorHandler";
import RequestInquiry from "~models/RequestInquiry";

export const STORED_REQUEST_INQUIRIES = "BUNQDESKTOP_STORED_REQUEST_INQUIRIES";

export function requestInquiriesSetInfo(requestInquiries, account_id, resetOldItems = false, BunqJSClient = false) {
    const type = resetOldItems ? "REQUEST_INQUIRIES_SET_INFO" : "REQUEST_INQUIRIES_UPDATE_INFO";

    return {
        type: type,
        payload: {
            requestInquiries,
            account_id
        }
    };
}

export function loadStoredRequestInquiries() {
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return dispatch => {
        dispatch(requestInquiriesLoading());
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(STORED_REQUEST_INQUIRIES)
            .then(data => {
                if (data && data.items) {
                    const newRequestInquiries = data.items.map(item => (new RequestInquiry(item)).toPlainObject());
                    dispatch(requestInquiriesSetInfo(newRequestInquiries, data.account_id));
                }
                dispatch(requestInquiriesNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiriesNotLoading());
            });
    };
}

export function requestInquiriesUpdate(
    userId,
    accountId,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We received the following error while sending your request inquiry");

    return dispatch => {
        dispatch(requestInquiriesLoading());
        BunqJSClient.api.requestInquiry
            .list(userId, accountId, options)
            .then(requestInquiries => {
                const newRequestInquiries = requestInquiries.map(item => (new RequestInquiry(item)).toPlainObject());
                dispatch(requestInquiriesSetInfo(newRequestInquiries, accountId, false));
                dispatch(requestInquiriesNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiriesNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
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
