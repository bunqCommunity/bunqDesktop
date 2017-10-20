const store = require("store");

const userDefault = store.get("user_type") !== undefined ? store.get("user_type") : false;
export const defaultState = {
    user: false,
    user_type: userDefault,
    loading: false,
    initialCheck: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "USER_SET_INFO":
            store.set("user_type", action.payload.user_type);
            return {
                ...state,
                user: action.payload.user,
                user_type: action.payload.user_type,
                initialCheck: true
            };

        case "USER_LOGOUT":
            store.remove("user_type");
            return {
                ...state,
                user: false,
                user_type: false,
            };

        case "USER_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "USER_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "USER_INITIAL_CHECK":
            return {
                ...state,
                initialCheck: true
            };

        case "USER_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
            store.remove("user_type");
            return {
                user: false,
                user_type: false,
                loading: false,
                initialCheck: false
            };
    }
    return state;
};
