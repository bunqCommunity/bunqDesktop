export const defaultState = {
    selected_card_ids: [],
    toggle: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "CARD_ID_FILTER_ADD":
            const currentCardIds = [...state.selected_card_ids];

            // prevent duplicates
            if (!currentCardIds.includes(action.payload.card_id)) {
                currentCardIds.push(action.payload.card_id);
            }

            return {
                ...state,
                selected_card_ids: currentCardIds
            };

        case "CARD_ID_FILTER_REMOVE":
            const currentCardIds2 = [...state.selected_card_ids];

            const removeIndex = currentCardIds2.findIndex(cardId => cardId === action.payload.card_id);
            if (removeIndex === -1) return state;

            currentCardIds2.splice(removeIndex, 1);

            return {
                ...state,
                selected_card_ids: currentCardIds2
            };

        case "CARD_ID_FILTER_TOGGLE":
            return {
                ...state,
                toggle: !state.toggle
            };

        case "CARD_ID_FILTER_CLEAR":
        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}
