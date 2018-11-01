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
