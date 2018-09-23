export const defaultState = {
    master_card_action_info: false,
    master_card_action_id: false,
    account_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "MASTER_CARD_ACTION_INFO_SET_INFO":
            return {
                ...state,
                master_card_action_info: action.payload.master_card_action_info,
                master_card_action_id: action.payload.master_card_action_id,
                account_id: action.payload.account_id
            };

        case "MASTER_CARD_ACTION_INFO_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "MASTER_CARD_ACTION_INFO_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "MASTER_CARD_ACTION_INFO_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                master_card_action_info: false,
                master_card_action_id: false,
                account_id: false,
                loading: false
            };
    }
    return state;
};
