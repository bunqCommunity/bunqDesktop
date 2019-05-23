const store = require("store");

export const CARD_ORDER_LOCATION = "BUNQDESKTOP_CARD_ORDER";

const cardOrderDefault = store.get(CARD_ORDER_LOCATION) !== undefined ? store.get(CARD_ORDER_LOCATION) : [];

export const defaultState = {
    cards: [],
    card_order: cardOrderDefault,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "CARDS_SET_INFO":
            const currentCardOrder = state.card_order ? state.card_order : [];
            const cardOrder = [...currentCardOrder];
            const cards = action.payload.cards;

            cards.forEach(card => {
                const cardId = card.id;
                if (!cardOrder.includes(cardId)) {
                    cardOrder.push(cardId);
                }
            });

            store.set(CARD_ORDER_LOCATION, cardOrder);
            return {
                ...state,
                cards: cards,
                card_order: cardOrder
            };

        case "CARDS_SET_CARD_ORDER":
            store.set(CARD_ORDER_LOCATION, action.payload.card_order);
            return {
                ...state,
                card_order: action.payload.card_order
            };

        case "CARDS_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "CARDS_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "CARDS_CLEAR":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(CARD_ORDER_LOCATION);
            return {
                cards: [],
                selectedCard: false,
                loading: false
            };
    }
    return state;
};
