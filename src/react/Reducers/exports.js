export const defaultState = {
    exports: [],
    user_id: false,
    account_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "EXPORTS_SET_INFO":
            return {
                ...state,
                exports: action.payload.exports,
                user_id: action.payload.user_id,
                account_id: action.payload.account_id
            };

        case "EXPORTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "EXPORTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "EXPORTS_CLEAR":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                ...defaultState
            };
    }
    return state;
};
