export const defaultState = {
    payment: false,
    account_id: false,
    payment_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "PAYMENT_INFO_SET_INFO":
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
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                payment: false,
                account_id: 0,
                payment_id: 0,
                loading: false
            };
    }
    return state;
};
