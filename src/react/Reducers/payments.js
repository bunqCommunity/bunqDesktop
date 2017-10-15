export const defaultState = {
    payments: [],
    account_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "PAYMENTS_SET_INFO":
            return {
                ...state,
                payments: action.payload.payments,
                account_id: action.payload.account_id,
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
            return {
                payments: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
