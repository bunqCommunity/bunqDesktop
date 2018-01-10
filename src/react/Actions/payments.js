import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function paymentsSetInfo(payments, account_id) {
    // get the newer and older id from the list
    const { 0: newer_payment, [payments.length - 1]: older_payment } = payments;

    return {
        type: "PAYMENTS_SET_INFO",
        payload: {
            payments,
            account_id,
            newer_id: newer_payment.Payment.id,
            older_id: older_payment.Payment.id
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
                dispatch(paymentsSetInfo(payments, account_id));
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
