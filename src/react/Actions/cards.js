import BunqErrorHandler from "../Functions/BunqErrorHandler";
import Card from "../Models/Card";

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

export function cardsUpdate(user_id) {
    const failedMessage = window.t("We failed to load the cards overview");

    return dispatch => {
        dispatch(cardsLoading());
        window.BunqDesktopClient.BunqJSClient.api.card
            .list(user_id)
            .then(cards => {
                const wrappedCards = cards.map(card => new Card(card));

                dispatch(cardsSetInfo(wrappedCards, user_id));
                dispatch(cardsNotLoading());
            })
            .catch(error => {
                dispatch(cardsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function cardsAssignAccounts(user_id, card_id, assignemnts) {
    const failedMessage = window.t("We failed to assign the accounts to this card");

    return dispatch => {
        dispatch(cardsLoading());
        window.BunqDesktopClient.BunqJSClient.api.card
            .update(user_id, card_id, null, null, null, null, null, null, assignemnts)
            .then(cards => {
                dispatch(cardsUpdate(user_id));
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
