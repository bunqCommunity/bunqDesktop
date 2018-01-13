export const defaultState = {
    payments: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let payments = [...state.payments];

    // check in what order payments are prepended/appended/overwritten
    switch (action.type) {
        case "PAYMENTS_SET_INFO":
            // overwrite current
            payments = [...action.payload.payments];
            break;
        case "PAYMENTS_ADD_NEWER_INFO":
            // add newer info to the beginning of the payments list
            payments = [...action.payload.payments, ...state.payments];
            break;
        case "PAYMENTS_ADD_OLDER_INFO":
            // add older info to the end of the payments list
            payments = [...state.payments, ...action.payload.payments];
            break;
    }

    switch (action.type) {
        case "PAYMENTS_ADD_NEWER_INFO":
        case "PAYMENTS_ADD_OLDER_INFO":
        case "PAYMENTS_SET_INFO":
            return {
                ...state,
                payments: payments,
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

        case "PAYMENTS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "PAYMENTS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "PAYMENTS_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                payments: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
