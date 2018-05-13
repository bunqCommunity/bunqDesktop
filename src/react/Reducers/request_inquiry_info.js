export const defaultState = {
    request_inquiry_info: false,
    account_id: false,
    request_inquiry_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REQUEST_INQUIRY_INFO_SET_INFO":
            return {
                ...state,
                request_inquiry_info: action.payload.request_inquiry_info,
                account_id: action.payload.account_id,
                request_inquiry_id: action.payload.request_inquiry_id
            };

        case "REQUEST_INQUIRY_INFO_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "REQUEST_INQUIRY_INFO_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "REQUEST_INQUIRY_INFO_CLEAR":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                request_inquiry_info: false,
                account_id: false,
                request_inquiry_id: false,
                loading: false
            };
    }
    return state;
};
