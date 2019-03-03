export const PENDING_PAYMENTS_LOCATION = "BUNQDESKTOP_STORED_PENDING_PAYMENTS";

export function loadPendingPayments(BunqJSClient) {
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

export function pendingPaymentsSetPayments(BunqJSClient, pendingPayments) {
    return {
        type: "PENDING_PAYMENTS_SET_PAYMENTS",
        payload: {
            BunqJSClient,
            pending_payments: pendingPayments
        }
    };
}

export function pendingPaymentsAddPayments(BunqJSClient, accountId, pendingPayments) {
    return {
        type: "PENDING_PAYMENTS_ADD_PAYMENTS",
        payload: {
            BunqJSClient,
            account_id: accountId,
            pending_payments: pendingPayments
        }
    };
}

export function pendingPaymentsAddPayment(BunqJSClient, accountId, pendingPayment) {
    return {
        type: "PENDING_PAYMENTS_ADD_PAYMENT",
        payload: {
            BunqJSClient,
            account_id: accountId,
            pending_payment: pendingPayment
        }
    };
}

export function pendingPaymentsClearAccount(BunqJSClient, accountId) {
    return {
        type: "PENDING_PAYMENTS_CLEAR_ACCOUNT",
        payload: {
            BunqJSClient,
            account_id: accountId
        }
    };
}

export function pendingPaymentsRemovePayment(BunqJSClient, pendingPaymentId) {
    return {
        type: "PENDING_PAYMENTS_REMOVE_PAYMENT",
        payload: {
            BunqJSClient,
            pending_payment_id: pendingPaymentId
        }
    };
}

export function pendingPaymentsClear() {
    return {
        type: "PENDING_PAYMENTS_CLEAR"
    };
}
