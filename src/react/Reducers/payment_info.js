import store from "store";

export const SELECTED_PAYMENT_ACCOUNT_LOCATION = "BUNQDESKTOP_SELECTED_PAYMENT_ACCOUNT";
export const SELECTED_PAYMENT_ID_LOCATION = "BUNQDESKTOP_SELECTED_PAYMENT_ID";

const selectedAccountDefault =
    store.get(SELECTED_PAYMENT_ACCOUNT_LOCATION) !== undefined
        ? store.get(SELECTED_PAYMENT_ACCOUNT_LOCATION)
        : false;
const selectedPaymentIdDefault =
    store.get(SELECTED_PAYMENT_ID_LOCATION) !== undefined
        ? store.get(SELECTED_PAYMENT_ID_LOCATION)
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
            store.set(SELECTED_PAYMENT_ID_LOCATION, action.payload.payment_id);
            store.set(SELECTED_PAYMENT_ACCOUNT_LOCATION, action.payload.account_id);
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
            store.remove(SELECTED_PAYMENT_ID_LOCATION);
            store.remove(SELECTED_PAYMENT_ACCOUNT_LOCATION);
            return {
                payment: false,
                account_id: 0,
                payment_id: 0,
                loading: false
            };
    }
    return state;
};
