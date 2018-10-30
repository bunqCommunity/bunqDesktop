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
        type: "PENDING_PAYMENTS_ADD_PAYMENTS",
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

export function pendingPaymentsClearAccountPayment(accountId, paymentIndex) {
    return {
        type: "PENDING_PAYMENTS_CLEAR_ACCOUNT_PAYMENT",
        payload: {
            account_id: accountId,
            payment_index: paymentIndex
        }
    };
}

export function pendingPaymentsClear() {
    return {
        type: "PENDING_PAYMENTS_CLEAR"
    };
}

export function pendingPaymentsLoading() {
    return { type: "PENDING_PAYMENTS_IS_LOADING" };
}

export function pendingPaymentsNotLoading() {
    return { type: "PENDING_PAYMENTS_IS_NOT_LOADING" };
}
