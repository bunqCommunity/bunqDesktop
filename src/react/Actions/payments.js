import BunqErrorHandler from "../Functions/BunqErrorHandler";
import { paymentApiFilter } from "../Functions/DataFilters";

import Payment from "../Models/Payment";

export const STORED_PAYMENTS = "BUNQDESKTOP_STORED_PAYMENTS";

export function paymentsSetInfo(payments, account_id, resetOldItems = false, BunqJSClient = false) {
    const type = resetOldItems ? "PAYMENTS_SET_INFO" : "PAYMENTS_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            payments,
            account_id
        }
    };
}

export function loadStoredPayments(BunqJSClient) {
    return dispatch => {
        dispatch(paymentsLoading());
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(STORED_PAYMENTS)
            .then(data => {
                if (data && data.items) {
                    // turn plain objects into Model objects
                    const paymentsNew = data.items.map(item => new Payment(item)).filter(paymentApiFilter);

                    dispatch(paymentsSetInfo(paymentsNew, data.account_id));
                }
                dispatch(paymentsNotLoading());
            })
            .catch(error => {
                dispatch(paymentsNotLoading());
            });
    };
}

export function paymentInfoUpdate(
    BunqJSClient,
    user_id,
    account_id,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the payments for this monetary account");

    return dispatch => {
        dispatch(paymentsLoading());

        BunqJSClient.api.payment
            .list(user_id, account_id, options)
            .then(payments => {
                // turn plain objects into Model objects
                const paymentsNew = payments.map(item => new Payment(item)).filter(paymentApiFilter);

                dispatch(paymentsSetInfo(paymentsNew, account_id, false, BunqJSClient));
                dispatch(paymentsNotLoading());
            })
            .catch(error => {
                dispatch(paymentsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
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
