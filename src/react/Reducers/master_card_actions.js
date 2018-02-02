export const defaultState = {
    master_card_actions: [],
    account_id: false,
    loading: false,
    newer_id: false,
    older_id: false
};

export default (state = defaultState, action) => {
    let master_card_actions = [...state.master_card_actions];

    // check in what order master_card_actions are prepended/appended/overwritten
    switch (action.type) {
        case "MASTER_CARD_ACTIONS_SET_INFO":
            // overwrite current
            master_card_actions = [...action.payload.master_card_actions];
            break;
        case "MASTER_CARD_ACTIONS_ADD_NEWER_INFO":
            // add newer info to the beginning of the master_card_actions list
            master_card_actions = [
                ...action.payload.master_card_actions,
                ...state.master_card_actions
            ];
            break;
        case "MASTER_CARD_ACTIONS_ADD_OLDER_INFO":
            // add older info to the end of the master_card_actions list
            master_card_actions = [
                ...state.master_card_actions,
                ...action.payload.master_card_actions
            ];
            break;
    }

    switch (action.type) {
        case "MASTER_CARD_ACTIONS_ADD_NEWER_INFO":
        case "MASTER_CARD_ACTIONS_ADD_OLDER_INFO":
        case "MASTER_CARD_ACTIONS_SET_INFO":
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
            if (action.type === "MASTER_CARD_ACTIONS_SET_INFO") {
                newerId = action.payload.newer_id;
                olderId = action.payload.older_id;
            }

            return {
                ...state,
                master_card_actions: master_card_actions,
                account_id: action.payload.account_id,
                newer_id: newerId,
                older_id: olderId
            };

        case "MASTER_CARD_ACTIONS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "MASTER_CARD_ACTIONS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "MASTER_CARD_ACTIONS_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                master_card_actions: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
