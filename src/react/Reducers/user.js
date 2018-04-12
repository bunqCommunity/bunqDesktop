const store = require("store");

export const USER_TYPE_LOCATION = "BUNQDESKTOP_USER_TYPE";

const userDefault =
    store.get(USER_TYPE_LOCATION) !== undefined
        ? store.get(USER_TYPE_LOCATION)
        : false;

export const defaultState = {
    user: false,
    user_type: userDefault,
    loading: false,
    initialCheck: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "USER_SET_INFO":
            store.set(USER_TYPE_LOCATION, action.payload.user_type);
            return {
                ...state,
                user: action.payload.user,
                user_type: action.payload.user_type,
                initialCheck: true
            };

        case "USER_LOGOUT":
            store.remove(USER_TYPE_LOCATION);
            return {
                ...state,
                user: false,
                user_type: false
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
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(USER_TYPE_LOCATION);
            return {
                user: false,
                user_type: false,
                loading: false,
                initialCheck: false
            };
    }
    return state;
};
