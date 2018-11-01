import { generateGUID } from "../Helpers/Utils";

export const defaultState = {
    last_updated: new Date(),
    pending_payments: {
        "random-payment-id": {
            account_id: 6301,
            id: "random-payment-id",
            payment: {
                amount: { currency: "EUR", value: "5.00" },
                counterparty_alias: { type: "IBAN", value: "NL55BUNQ9900053427", name: "Angel Monoghan" },
                description: "some description"
            }
        },
        "random-payment-id2": {
            account_id: 6301,
            id: "random-payment-id2",
            payment: {
                amount: { currency: "EUR", value: "10.00" },
                counterparty_alias: { type: "IBAN", value: "NL55BUNQ9900053427", name: "Angel Monoghan" },
                description: "Different description hehe"
            }
        },
        "other-account-payment-id": {
            account_id: 8366,
            id: "other-account-payment-id",
            payment: {
                amount: { currency: "EUR", value: "13.37" },
                counterparty_alias: { type: "IBAN", value: "NL55BUNQ9900053427", name: "Angel Monoghan" },
                description: "Other account description"
            }
        }
    }
};

export default (state = defaultState, action) => {
    let pendingPayments = { ...state.pending_payments };

    switch (action.type) {
        case "PENDING_PAYMENTS_ADD_PAYMENT":
            const newPendingPayment = action.payload.pending_payment;
            const pendingPaymentId = generateGUID();
            newPendingPayment.id = pendingPaymentId;

            pendingPayments[pendingPaymentId] = {
                account_id: action.payload.account_id,
                payment: newPendingPayment
            };

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: pendingPayments
            };

        case "PENDING_PAYMENTS_ADD_PAYMENTS":
            const newPendingPayments = action.payload.pending_payments;

            newPendingPayments.forEach(newPendingPayment => {
                const pendingPaymentId2 = generateGUID();
                newPendingPayment.id = pendingPaymentId2;

                pendingPayments[pendingPaymentId2] = {
                    account_id: action.payload.account_id,
                    payment: newPendingPayment
                };
            });

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: pendingPayments
            };

        case "PENDING_PAYMENTS_CLEAR_ACCOUNT":
            const clearAccountId = action.payload.account_id;

            Object.keys(pendingPayments).forEach(pendingPaymentId => {
                const pendingPaymentInfo = pendingPayments[pendingPaymentId];

                if (pendingPaymentInfo.account_id === clearAccountId) {
                    delete pendingPayments[pendingPaymentId];
                }
            });

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: pendingPayments
            };

        case "PENDING_PAYMENTS_REMOVE_PAYMENT":
            const clearPendingPaymentId = action.payload.pending_payment_id;

            if (pendingPayments[clearPendingPaymentId]) {
                delete pendingPayments[clearPendingPaymentId];
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
