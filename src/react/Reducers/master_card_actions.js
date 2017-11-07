export const defaultState = {
    master_card_actions: [],
    account_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "MASTER_CARD_ACTIONS_SET_INFO":
            return {
                ...state,
                master_card_actions: action.payload.master_card_actions,
                account_id: action.payload.account_id,
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
            return {
                master_card_actions: [],
                account_id: false,
                loading: false
            };
    }
    return state;
};
