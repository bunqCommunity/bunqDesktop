import store from "store";
import { generateGUID } from "../Helpers/Utils";
import { storeEncryptString } from "../Helpers/CryptoWorkerWrapper";
import { PENDING_PAYMENTS_LOCATION } from "../Actions/pending_payments";

export const defaultState = {
    last_updated: new Date(),
    pending_payments: {}
};

export default (state = defaultState, action) => {
    let pendingPayments = { ...state.pending_payments };

    switch (action.type) {
        case "PENDING_PAYMENTS_SET_PAYMENTS":
            const newSetPendingPayment = action.payload.pending_payments;

            if (action.payload.BunqJSClient) {
                storeEncryptString(
                    newSetPendingPayment,
                    PENDING_PAYMENTS_LOCATION,
                    action.payload.BunqJSClient.Session.encryptionKey
                )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: newSetPendingPayment
            };

        case "PENDING_PAYMENTS_ADD_PAYMENT":
            const newPendingPayment = action.payload.pending_payment;
            const pendingPaymentId = generateGUID();

            pendingPayments[pendingPaymentId] = {
                id: pendingPaymentId,
                account_id: action.payload.account_id,
                payment: newPendingPayment
            };

            if (action.payload.BunqJSClient) {
                storeEncryptString(
                    pendingPayments,
                    PENDING_PAYMENTS_LOCATION,
                    action.payload.BunqJSClient.Session.encryptionKey
                )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                last_updated: new Date(),
                pending_payments: pendingPayments
            };

        case "PENDING_PAYMENTS_ADD_PAYMENTS":
            const newPendingPayments = action.payload.pending_payments;

            newPendingPayments.forEach(newPendingPayment => {
                const pendingPaymentId2 = generateGUID();

                pendingPayments[pendingPaymentId2] = {
                    id: pendingPaymentId2,
                    account_id: action.payload.account_id,
                    payment: newPendingPayment
                };
            });

            if (action.payload.BunqJSClient) {
                storeEncryptString(
                    pendingPayments,
                    PENDING_PAYMENTS_LOCATION,
                    action.payload.BunqJSClient.Session.encryptionKey
                )
                    .then(() => {})
                    .catch(() => {});
            }

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

            if (action.payload.BunqJSClient) {
                storeEncryptString(
                    pendingPayments,
                    PENDING_PAYMENTS_LOCATION,
                    action.payload.BunqJSClient.Session.encryptionKey
                )
                    .then(() => {})
                    .catch(() => {});
            }

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

            if (action.payload.BunqJSClient) {
                storeEncryptString(
                    pendingPayments,
                    PENDING_PAYMENTS_LOCATION,
                    action.payload.BunqJSClient.Session.encryptionKey
                )
                    .then(() => {})
                    .catch(() => {});
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
            store.remove(PENDING_PAYMENTS_LOCATION);
            return { ...defaultState };
    }
    return state;
};
