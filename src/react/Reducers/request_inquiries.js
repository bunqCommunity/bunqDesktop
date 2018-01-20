export const defaultState = {
    request_inquiries: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let request_inquiries = [...state.request_inquiries];

    // check in what order request_inquiries are prepended/appended/overwritten
    switch (action.type) {
        case "REQUEST_INQUIRIES_SET_INFO":
            // overwrite current
            request_inquiries = [...action.payload.request_inquiries];
            break;
        case "REQUEST_INQUIRIES_ADD_NEWER_INFO":
            // add newer info to the beginning of the request_inquiries list
            request_inquiries = [
                ...action.payload.request_inquiries,
                ...state.request_inquiries
            ];
            break;
        case "REQUEST_INQUIRIES_ADD_OLDER_INFO":
            // add older info to the end of the request_inquiries list
            request_inquiries = [
                ...state.request_inquiries,
                ...action.payload.request_inquiries
            ];
            break;
    }

    switch (action.type) {
        case "REQUEST_INQUIRIES_ADD_NEWER_INFO":
        case "REQUEST_INQUIRIES_ADD_OLDER_INFO":
        case "REQUEST_INQUIRIES_SET_INFO":
            return {
                ...state,
                request_inquiries: request_inquiries,
                account_id: action.payload.account_id,
                newer_id:
                    state.newer_id === false ||
                    state.newer_id < action.payload.newer_id
                        ? action.payload.newer_id
                        : state.newer_id,
                older_id:
                    state.older_id === false ||
                    state.older_id > action.payload.older_id
                        ? action.payload.older_id
                        : state.older_id
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
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                request_inquiries: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
