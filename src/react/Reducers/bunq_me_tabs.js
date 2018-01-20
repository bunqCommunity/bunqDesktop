export const defaultState = {
    bunq_me_tabs: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let bunq_me_tabs = [...state.bunq_me_tabs];

    // check in what order bunq_me_tabs are prepended/appended/overwritten
    switch (action.type) {
        case "BUNQ_ME_TABS_SET_INFO":
            // overwrite current
            bunq_me_tabs = [...action.payload.bunq_me_tabs];
            break;
        case "BUNQ_ME_TABS_ADD_NEWER_INFO":
            // add newer info to the beginning of the bunq_me_tabs list
            bunq_me_tabs = [
                ...action.payload.bunq_me_tabs,
                ...state.bunq_me_tabs
            ];
            break;
        case "BUNQ_ME_TABS_ADD_OLDER_INFO":
            // add older info to the end of the bunq_me_tabs list
            bunq_me_tabs = [
                ...state.bunq_me_tabs,
                ...action.payload.bunq_me_tabs
            ];
            break;
    }

    switch (action.type) {
        case "BUNQ_ME_TABS_ADD_NEWER_INFO":
        case "BUNQ_ME_TABS_ADD_OLDER_INFO":
        case "BUNQ_ME_TABS_SET_INFO":
            return {
                ...state,
                bunq_me_tabs: bunq_me_tabs,
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

        case "BUNQ_ME_TABS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "BUNQ_ME_TABS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "BUNQ_ME_TABS_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                bunq_me_tabs: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
