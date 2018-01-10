export const defaultState = {
    payments: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "PAYMENTS_SET_INFO":
            return {
                ...state,
                payments: action.payload.payments,
                account_id: action.payload.account_id,
                newer_id: action.payload.newer_id,
                older_id: action.payload.older_id,
            };

        case "PAYMENTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "PAYMENTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "PAYMENTS_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                payments: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
