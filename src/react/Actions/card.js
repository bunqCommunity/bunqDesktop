import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function cardSetInfo(cards, user_id) {
    return {
        type: "CARD_SET_INFO",
        payload: {
            user_id: user_id,
            cards: cards
        }
    };
}

export function cardUpdate(BunqJSClient, user_id) {
    const failedMessage = window.t("We failed to load the cards overview");

    return dispatch => {
        dispatch(cardLoading());
        BunqJSClient.api.card
            .list(user_id)
            .then(cards => {
                dispatch(cardSetInfo(cards, user_id));
                dispatch(cardNotLoading());
            })
            .catch(error => {
                dispatch(cardNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    failedMessage
                );
            });
    };
}

export function cardLoading() {
    return { type: "CARD_IS_LOADING" };
}

export function cardNotLoading() {
    return { type: "CARD_IS_NOT_LOADING" };
}

export function cardClear() {
    return { type: "CARD_CLEAR" };
}
