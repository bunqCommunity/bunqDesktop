export const defaultState = {
    request_responses: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let request_responses = [...state.request_responses];

    // check in what order request_responses are prepended/appended/overwritten
    switch (action.type) {
        case "REQUEST_RESPONSES_SET_INFO":
            // overwrite current
            request_responses = [...action.payload.request_responses];
            break;
        case "REQUEST_RESPONSES_ADD_NEWER_INFO":
            // add newer info to the beginning of the request_responses list
            request_responses = [
                ...action.payload.request_responses,
                ...state.request_responses
            ];
            break;
        case "REQUEST_RESPONSES_ADD_OLDER_INFO":
            // add older info to the end of the request_responses list
            request_responses = [
                ...state.request_responses,
                ...action.payload.request_responses
            ];
            break;
    }

    switch (action.type) {
        case "REQUEST_RESPONSES_ADD_NEWER_INFO":
        case "REQUEST_RESPONSES_ADD_OLDER_INFO":
        case "REQUEST_RESPONSES_SET_INFO":
            let newerId =
                state.newer_id === false ||
                state.newer_id < action.payload.newer_id
                    ? action.payload.newer_id
                    : state.newer_id;

            let olderId =
                state.older_id === false ||
                state.older_id > action.payload.older_id
                    ? action.payload.older_id
                    : state.older_id;

            // this action overwrites previously stored IDs
            if (action.type === "REQUEST_RESPONSES_SET_INFO") {
                newerId = action.payload.newer_id;
                olderId = action.payload.older_id;
            }

            return {
                ...state,
                request_responses: request_responses,
                account_id: action.payload.account_id,
                newer_id: newerId,
                older_id: olderId
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
