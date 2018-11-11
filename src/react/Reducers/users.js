export const defaultState = {
    loading: false,
    initialCheck: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "USERS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "USERS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "USERS_INITIAL_CHECK":
            return {
                ...state,
                initialCheck: true
            };

        case "USERS_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                ...defaultState
            };
    }
    return state;
};
