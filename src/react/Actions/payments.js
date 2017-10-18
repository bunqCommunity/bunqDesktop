const Logger = require("../Helpers/Logger");
import { openModal } from "./modal";

export function paymentsSetInfo(payments, account_id) {
    // return the action
    return {
        type: "PAYMENTS_SET_INFO",
        payload: {
            payments: payments,
            account_id: account_id
        }
    };
}

export function paymentsUpdate(BunqJSClient, user_id, account_id) {
    return dispatch => {
        dispatch(paymentsLoading());
        BunqJSClient.api.payment
            .list(user_id, account_id)
            .then(payments => {
                dispatch(paymentsSetInfo(payments, account_id));
                dispatch(paymentsNotLoading());
            })
            .catch(err => {
                Logger.trace(err);
                dispatch(
                    openModal(
                        "We failed to load the payments for this monetary account",
                        "Something went wrong"
                    )
                );
                dispatch(paymentsNotLoading());
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
