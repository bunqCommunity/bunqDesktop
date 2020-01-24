import { AppWindow } from "~app";
import BunqDesktopClient from "~components/BunqDesktopClient";
import BunqErrorHandler from "~functions/BunqErrorHandler";
import { actions } from "./index";

declare let window: AppWindow;

export function cardUpdateCvc2Codes(user_id, card_id) {
    const failedMessage = window.t("We failed to load the CVC codes");

    return async (dispatch) => {
        dispatch(actions.isLoading());

        const batchedActions = [];
        try {
            let cardsCvc2Codes = await window.BunqDesktopClient.BunqJSClient.api.cardCvc2.list(user_id, card_id);
            // turn string dates into date objects
            cardsCvc2Codes = cardsCvc2Codes.map(cardsCvc2Code => {
                const cardCvc2Info = cardsCvc2Code.CardGeneratedCvc2;
                return {
                    ...cardCvc2Info,
                    created: new Date(cardCvc2Info.created),
                    updated: new Date(cardCvc2Info.updated),
                    expiry_time: new Date(cardCvc2Info.expiry_time)
                };
            });

            batchedActions.push(actions.setInfo({ cvc2_codes: cardsCvc2Codes, user_id, card_id }));
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading()]));
        }
    };
}

export function cardGenerateCvc2(user_id, card_id, type: "GENERATED" | "STATIC" = "GENERATED") {
    return async (dispatch) => {
        dispatch(actions.isLoading());

        const dispatchedActions = [];
        try {
            const cardsCvc2Code = await window.BunqDesktopClient.BunqJSClient.api.cardCvc2.post(user_id, card_id, type);
            dispatch(actions.setInfo({ cvc2_codes: [cardsCvc2Code.CardGeneratedCvc2], user_id, card_id }));
        } catch (error) {
            BunqErrorHandler(dispatch, error, "We failed to generate a new CVC code");
        } finally {
            dispatch(dispatchedActions.concat([actions.isNotLoading()]));
        }
    };
}
