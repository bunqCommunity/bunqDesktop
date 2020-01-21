import { AppWindow } from "~app";
import BunqDesktopClient from "~components/BunqDesktopClient";
import BunqErrorHandler from "~functions/BunqErrorHandler";
import Card from "~models/Card";
import { actions } from "./index";

declare let window: AppWindow;

export function cardsUpdate(user_id) {
    const failedMessage = window.t("We failed to load the cards overview");

    return async (dispatch) => {
        dispatch(actions.isLoading());

        const batchedActions = [];
        try {
            const cards: number[] = await window.BunqDesktopClient.BunqJSClient.api.card.list(user_id);
            const wrappedCards = cards.map(card => new Card(card));

            batchedActions.push(actions.setInfo({ cards: wrappedCards, user_id }));
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading()]));
        }
    };
}

export function cardsAssignAccounts(user_id, card_id, assignments) {
    const failedMessage = window.t("We failed to assign the accounts to this card");

    return async (dispatch) => {
        dispatch(actions.isLoading());

        const batchedActions = [];
        try {
            await window.BunqDesktopClient.BunqJSClient.api.card.update(
                user_id,
                card_id,
                null,
                null,
                null,
                null,
                null,
                null,
                assignments
            );
            dispatch(cardsUpdate(user_id));
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading()]));
        }
    };
}

