export const defaultState = {
    last_updated: new Date(),
    pending_payments: {}
};

export default (state = defaultState, action) => {
    let pendingPayments = { ...state.pending_payments };

    switch (action.type) {
        case "PENDING_PAYMENTS_ADD_PAYMENT":
            const newPendingPayment = action.payload.pending_payment;

            if (!pendingPayments[action.payload.account_id]) pendingPayments[action.payload.account_id] = [];
            pendingPayments[action.payload.account_id].push(newPendingPayment);

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: pendingPayments
            };

        case "PENDING_PAYMENTS_ADD_PAYMENTS":
            const newPendingPayments = action.payload.pending_payments;

            if (!pendingPayments[action.payload.account_id]) pendingPayments[action.payload.account_id] = [];
            pendingPayments[action.payload.account_id] = [
                ...pendingPayments[action.payload.account_id],
                ...newPendingPayments
            ];

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: pendingPayments
            };

        case "PENDING_PAYMENTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };
        case "PENDING_PAYMENTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "PENDING_PAYMENTS_CLEAR_ACCOUNT":
            const clearAccountId = action.payload.account_id;
            if (pendingPayments[clearAccountId]) {
                delete pendingPayments[clearAccountId];
            }

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: pendingPayments
            };

        case "PENDING_PAYMENTS_CLEAR_ACCOUNT_PAYMENT":
            const clearPaymentAccountId = action.payload.account_id;
            const clearPaymentIndex = action.payload.payment_index;

            if (pendingPayments[clearPaymentAccountId]) {
                if (pendingPayments[clearPaymentAccountId][clearPaymentIndex]) {
                    pendingPayments[clearPaymentAccountId][clearPaymentIndex].splice(clearPaymentIndex, 1);
                }
            }

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: pendingPayments
            };

        case "PENDING_PAYMENTS_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            return { ...defaultState };
    }
    return state;
};
