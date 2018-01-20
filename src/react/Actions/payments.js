import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function paymentsSetInfo(
    payments,
    account_id,
    newer = false,
    older = false
) {
    // get the newer and older id from the list
    const { 0: newerItem, [payments.length - 1]: olderItem } = payments;

    let type = "PAYMENTS_SET_INFO";
    if (newer !== false) {
        type = "PAYMENTS_ADD_NEWER_INFO";
    } else if (older !== false) {
        type = "PAYMENTS_ADD_OLDER_INFO";
    }

    return {
        type: type,
        payload: {
            payments,
            account_id,
            newer_id: newerItem ? newerItem.Payment.id : newer,
            older_id: olderItem ? olderItem.Payment.id : older
        }
    };
}

export function paymentInfoUpdate(
    BunqJSClient,
    user_id,
    account_id,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(paymentsLoading());
        BunqJSClient.api.payment
            .list(user_id, account_id, options)
            .then(payments => {
                // if we have a newer/older id we need to trigger a different event
                if (options.newer_id && options.newer_id !== false) {
                    dispatch(
                        paymentsSetInfo(payments, account_id, options.newer_id, false)
                    );
                } else if (options.older_id && options.older_id !== false) {
                    dispatch(
                        paymentsSetInfo(payments, account_id, false, options.older_id)
                    );
                } else {
                    dispatch(paymentsSetInfo(payments, account_id));
                }

                dispatch(paymentsNotLoading());
            })
            .catch(error => {
                dispatch(paymentsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the payments for this monetary account"
                );
            });
    };
}

export function paymentsLoading() {
    return { type: "PAYMENTS_IS_LOADING" };
}

export function paymentsNotLoading() {
    return { type: "PAYMENTS_IS_NOT_LOADING" };
}

export function paymentsClear() {
    return { type: "PAYMENTS_CLEAR" };
}
