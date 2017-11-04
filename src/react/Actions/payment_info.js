import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function paymentInfoSetInfo(payment, account_id, payment_id) {
    return {
        type: "PAYMENT_INFO_SET_INFO",
        payload: {
            payment: payment,
            account_id: account_id,
            payment_id: payment_id
        }
    };
}

export function paymentsUpdate(BunqJSClient, user_id, account_id, payment_id) {
    return dispatch => {
        dispatch(paymentInfoLoading());
        BunqJSClient.api.payment
            .get(user_id, account_id, payment_id)
            .then(paymentInfo => {
                dispatch(
                    paymentInfoSetInfo(paymentInfo, account_id, payment_id)
                );
                dispatch(paymentInfoNotLoading());
            })
            .catch(error => {
                dispatch(paymentInfoNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the payment info"
                );
            });
    };
}

export function paymentInfoLoading() {
    return { type: "PAYMENT_INFO_IS_LOADING" };
}

export function paymentInfoNotLoading() {
    return { type: "PAYMENT_INFO_IS_NOT_LOADING" };
}

export function paymentInfoClear() {
    return { type: "PAYMENT_INFO_CLEAR" };
}
