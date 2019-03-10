export const defaultState = {
    event: false,
    account_id: false,
    event_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "EVENT_INFO_SET_INFO":
            return {
                ...state,
                event: action.payload.event,
                event_id: action.payload.event_id
            };

        case "EVENT_INFO_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "EVENT_INFO_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "EVENT_INFO_CLEAR":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                event: false,
                event_id: 0,
                loading: false
            };
    }
    return state;
};
