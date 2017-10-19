export const defaultState = {
    derivedPassword: false,
    status_message: ""
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "APPLICATION_SET_DERIVED_PASSWORD":
            return {
                ...state,
                derivedPassword: action.payload.derivedPassword
            };

        case "APPLICATION_SET_STATUS_MESSAGE":
            return {
                ...state,
                status_message: action.payload.status_message
            };

        case "APPLICATION_CLEAR_PASSWORD":
            return {
                ...state,
                derivedPassword: false
            };

        case "APPLICATION_LOADING_PASSWORD":
            return {
                ...state,
                loading: true
            };
        case "APPLICATION_NOT_LOADING_PASSWORD":
            return {
                ...state,
                loading: false
            };
    }
    return state;
};
