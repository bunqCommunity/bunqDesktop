export const defaultState = {
    bunq_me_tabs: [],
    account_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "BUNQ_ME_TABS_SET_INFO":
            return {
                ...state,
                bunq_me_tabs: action.payload.bunq_me_tabs,
                account_id: action.payload.account_id,
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
