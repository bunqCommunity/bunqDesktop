export const defaultState = {
    loading: false,
    cvc2_codes: [],
    user_id: false,
    card_id: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "CARD_CVC2_SET_INFO":
            return {
                ...state,
                card_id: action.payload.card_id,
                user_id: action.payload.user_id,
                cvc2_codes: action.payload.cvc2_codes
            };

        case "CARD_CVC2_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "CARD_CVC2_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "CARD_CVC2_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                ...state,
                ...defaultState
            };
    }
    return state;
};
