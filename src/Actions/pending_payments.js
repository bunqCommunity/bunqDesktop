export const PENDING_PAYMENTS_LOCATION = "BUNQDESKTOP_STORED_PENDING_PAYMENTS";

export function loadPendingPayments() {
    return dispatch => {
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(PENDING_PAYMENTS_LOCATION)
            .then(data => {
                if (data) {
                    dispatch(pendingPaymentsSetPayments(false, data));
                }
            })
            .catch(error => {});
    };
}

export function pendingPaymentsSetPayments(pendingPayments) {
    return {
        type: "PENDING_PAYMENTS_SET_PAYMENTS",
        payload: {
            pending_payments: pendingPayments
        }
    };
}

export function pendingPaymentsAddPayments(accountId, pendingPayments) {
    return {
        type: "PENDING_PAYMENTS_ADD_PAYMENTS",
        payload: {
            account_id: accountId,
            pending_payments: pendingPayments
        }
    };
}

export function pendingPaymentsAddPayment(accountId, pendingPayment) {
    return {
        type: "PENDING_PAYMENTS_ADD_PAYMENT",
        payload: {
            account_id: accountId,
            pending_payment: pendingPayment
        }
    };
}

export function pendingPaymentsClearAccount(accountId) {
    return {
        type: "PENDING_PAYMENTS_CLEAR_ACCOUNT",
        payload: {
            account_id: accountId
        }
    };
}

export function pendingPaymentsRemovePayment(pendingPaymentId) {
    return {
        type: "PENDING_PAYMENTS_REMOVE_PAYMENT",
        payload: {
            pending_payment_id: pendingPaymentId
        }
    };
}

export function pendingPaymentsClear() {
    return {
        type: "PENDING_PAYMENTS_CLEAR"
    };
}
