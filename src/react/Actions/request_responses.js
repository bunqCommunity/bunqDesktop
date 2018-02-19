import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function requestResponsesSetInfo(
    request_responses,
    account_id,
    newer = false,
    older = false
) {
    // get the newer and older id from the list
    const {
        0: newerItem,
        [request_responses.length - 1]: olderItem
    } = request_responses;

    let type = "REQUEST_RESPONSES_SET_INFO";
    if (newer !== false) {
        type = "REQUEST_RESPONSES_ADD_NEWER_INFO";
    } else if (older !== false) {
        type = "REQUEST_RESPONSES_ADD_OLDER_INFO";
    }

    return {
        type: type,
        payload: {
            request_responses,
            account_id,
            newer_id: newerItem ? newerItem.RequestResponse.id : newer,
            older_id: olderItem ? olderItem.RequestResponse.id : older
        }
    };
}

export function requestResponsesUpdate(
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
        dispatch(requestResponsesLoading());
        BunqJSClient.api.requestResponse
            .list(userId, accountId, options)
            .then(requestResponses => {
                // if we have a newer/older id we need to trigger a different event
                if (options.newer_id && options.newer_id !== false) {
                    dispatch(
                        requestResponsesSetInfo(
                            requestResponses,
                            accountId,
                            options.newer_id,
                            false
                        )
                    );
                } else if (options.older_id && options.older_id !== false) {
                    dispatch(
                        requestResponsesSetInfo(
                            requestResponses,
                            accountId,
                            false,
                            options.older_id
                        )
                    );
                } else {
                    dispatch(
                        requestResponsesSetInfo(requestResponses, accountId)
                    );
                }

                dispatch(requestResponsesNotLoading());
            })
            .catch(error => {
                dispatch(requestResponsesNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while loading your request responses"
                );
            });
    };
}

export function requestResponsesLoading() {
    return { type: "REQUEST_RESPONSES_IS_LOADING" };
}

export function requestResponsesNotLoading() {
    return { type: "REQUEST_RESPONSES_IS_NOT_LOADING" };
}

export function requestResponsesClear() {
    return { type: "REQUEST_RESPONSES_CLEAR" };
}
