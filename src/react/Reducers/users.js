export const defaultState = {
    users: [],
    loading: false,
    initialCheck: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "USERS_SET_INFO":
            return {
                ...state,
                users: action.payload.users
            };

        case "USERS_LOGOUT":
            return {
                ...state,
                users: []
            };

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
            return {
                users: [],
                loading: false,
                initialCheck: false
            };
    }
    return state;
};
