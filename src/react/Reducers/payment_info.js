import store from "store";

const selectedAccountDefault =
    store.get("selected_payment_account") !== undefined
        ? store.get("selected_account")
        : false;
const selectedPaymentIdDefault =
    store.get("selected_payment_id") !== undefined
        ? store.get("selected_payment")
        : false;

export const defaultState = {
    payment: false,
    account_id: selectedAccountDefault,
    payment_id: selectedPaymentIdDefault,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "PAYMENT_INFO_SET_INFO":
            store.set("selected_payment_id", action.payload.payment_id);
            store.set("selected_payment_account", action.payload.account_id);
            return {
                ...state,
                payment: action.payload.payment,
                account_id: action.payload.account_id,
                payment_id: action.payload.payment_id
            };

        case "PAYMENT_INFO_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "PAYMENT_INFO_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "PAYMENT_INFO_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
            return {
                payment: false,
                account_id: 0,
                payment_id: 0,
                loading: false
            };
    }
    return state;
};
