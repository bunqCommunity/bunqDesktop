import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function requestInquiriesSetInfo(
    request_inquiries,
    account_id,
    newer = false,
    older = false
) {
    // get the newer and older id from the list
    const {
        0: newerItem,
        [request_inquiries.length - 1]: olderItem
    } = request_inquiries;

    let type = "REQUEST_INQUIRIES_SET_INFO";
    if (newer !== false) {
        type = "REQUEST_INQUIRIES_ADD_NEWER_INFO";
    } else if (older !== false) {
        type = "REQUEST_INQUIRIES_ADD_OLDER_INFO";
    }

    return {
        type: type,
        payload: {
            request_inquiries,
            account_id,
            newer_id: newerItem ? newerItem.RequestInquiry.id : newer,
            older_id: olderItem ? olderItem.RequestInquiry.id : older
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
                // if we have a newer/older id we need to trigger a different event
                if (options.newer_id && options.newer_id !== false) {
                    dispatch(
                        requestInquiriesSetInfo(
                            requestInquiries,
                            accountId,
                            options.newer_id,
                            false
                        )
                    );
                } else if (options.older_id && options.older_id !== false) {
                    dispatch(
                        requestInquiriesSetInfo(
                            requestInquiries,
                            accountId,
                            false,
                            options.older_id
                        )
                    );
                } else {
                    dispatch(
                        requestInquiriesSetInfo(requestInquiries, accountId)
                    );
                }

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
