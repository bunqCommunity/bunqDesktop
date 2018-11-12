import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function cardsSetInfo(cards, user_id) {
    return {
        type: "CARDS_SET_INFO",
        payload: {
            user_id: user_id,
            cards: cards
        }
    };
}

export function cardsSetCardOrder(cardOrder) {
    return {
        type: "CARDS_SET_CARD_ORDER",
        payload: {
            card_order: cardOrder
        }
    };
}

export function cardsUpdate(BunqJSClient, user_id) {
    const failedMessage = window.t("We failed to load the cards overview");

    return dispatch => {
        dispatch(cardsLoading());
        BunqJSClient.api.card
            .list(user_id)
            .then(cards => {
                dispatch(cardsSetInfo(cards, user_id));
                dispatch(cardsNotLoading());
            })
            .catch(error => {
                dispatch(cardsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function cardsLoading() {
    return { type: "CARDS_IS_LOADING" };
}

export function cardsNotLoading() {
    return { type: "CARDS_IS_NOT_LOADING" };
}

export function cardClear() {
    return { type: "CARDS_CLEAR" };
}
