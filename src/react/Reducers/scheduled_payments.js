export const defaultState = {
    scheduled_payments: [],
    account_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "SCHEDULED_PAYMENTS_SET_INFO":
            return {
                ...state,
                scheduled_payments: action.payload.scheduled_payments,
                account_id: action.payload.account_id
            };

        case "SCHEDULED_PAYMENTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "SCHEDULED_PAYMENTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "SCHEDULED_PAYMENTS_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                scheduled_payments: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
