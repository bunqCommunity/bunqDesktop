const store = require("store");

const userDefault = store.get("user") !== undefined ? store.get("user") : false;
export const defaultState = {
    user: userDefault,
    loading: false,
    initialCheck: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "USER_SET_INFO":
            store.set("user", action.payload.user);
            return {
                ...state,
                user: action.payload.user,
                initialCheck: true
            };

        case "USER_LOGOUT":
            store.remove("user");
            return {
                ...state,
                user: false
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
            store.remove("user");
            return {
                user: false,
                loading: false,
                initialCheck: false
            };
    }
    return state;
};
