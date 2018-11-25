export const defaultState = {
    selected_account_ids: [],
    toggle: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "ACCOUNT_ID_FILTER_ADD":
            const currentAccountIds = [...state.selected_account_ids];

            // prevent duplicates
            if (!currentAccountIds.includes(action.payload.account_id)) {
                currentAccountIds.push(action.payload.account_id);
            }

            return {
                ...state,
                selected_account_ids: currentAccountIds
            };

        case "ACCOUNT_ID_FILTER_REMOVE":
            const currentAccountIds2 = [...state.selected_account_ids];

            const removeIndex = currentAccountIds2.findIndex(accountId => accountId === action.payload.account_id);
            if (removeIndex === -1) return state;

            currentAccountIds2.splice(removeIndex, 1);

            return {
                ...state,
                selected_account_ids: currentAccountIds2
            };

        case "ACCOUNT_ID_FILTER_TOGGLE":
            return {
                ...state,
                toggle: !state.toggle
            };

        case "ACCOUNT_ID_FILTER_CLEAR":
        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}
