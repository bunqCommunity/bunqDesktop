export const defaultState = {
    amount: null
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "AMOUNT_FILTER_SET":
            const currentAccountIds = [...state.selected_account_ids];

            // prevent duplicates
            if (!currentAccountIds.includes(action.payload.account_id)) {
                currentAccountIds.push(action.payload.account_id);
            }

            return {
                ...state,
                selected_account_ids: currentAccountIds
            };

        case "AMOUNT_FILTER_CLEAR":
        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}
