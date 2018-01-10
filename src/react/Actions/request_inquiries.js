import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function requestInquiriesSetInfo(request_inquiries, account_id) {
    return {
        type: "REQUEST_INQUIRIES_SET_INFO",
        payload: {
            request_inquiries: request_inquiries,
            account_id: account_id
        }
    };
}

export function requestInquiriesUpdate(
    BunqJSClient,
    userId,
    accountId,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(requestInquiriesLoading());
        BunqJSClient.api.requestInquiry
            .list(userId, accountId, options)
            .then(requestInquiries => {
                dispatch(requestInquiriesSetInfo(requestInquiries, accountId));
                dispatch(requestInquiriesNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiriesNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while sending your request inquiry"
                );
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
