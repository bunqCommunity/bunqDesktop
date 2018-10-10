const store = require("store");

export const SELECTED_CARD_LOCATION = "BUNQDESKTOP_SELECTED_CARD";

const selectedCardDefault = store.get(SELECTED_CARD_LOCATION) !== undefined ? store.get(SELECTED_CARD_LOCATION) : false;

export const defaultState = {
    cards: [],
    selectedcard: selectedCardDefault,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "CARD_SET_INFO":
            return {
                ...state,
                cards: action.payload.cards
            };

        case "CARD_SELECT_CARD":
            store.set(SELECTED_CARD_LOCATION, action.payload.selectedCard);
            return {
                ...state,
                selectedCard: action.payload.selectedCard
            };

        case "CARD_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "CARD_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "CARDS_CLEAR":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(SELECTED_CARD_LOCATION);
            return {
                cards: [],
                selectedCard: false,
                loading: false
            };
    }
    return state;
};
