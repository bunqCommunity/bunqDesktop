export const defaultState = {
    request_inquiries: [],
    account_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REQUEST_INQUIRIES_SET_INFO":
            return {
                ...state,
                request_inquiries: action.payload.request_inquiries,
                account_id: action.payload.account_id,
            };

        case "REQUEST_INQUIRIES_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "REQUEST_INQUIRIES_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "REQUEST_INQUIRIES_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
            return {
                request_inquiries: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
