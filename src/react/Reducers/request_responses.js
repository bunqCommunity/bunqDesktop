export const defaultState = {
    request_responses: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REQUEST_RESPONSES_SET_INFO":
            return {
                ...state,
                request_responses: action.payload.request_responses,
                account_id: action.payload.account_id,
            };

        case "REQUEST_RESPONSES_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "REQUEST_RESPONSES_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "REQUEST_RESPONSES_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                request_responses: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
