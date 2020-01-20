import BunqJSClient from "@bunq-community/bunq-js-client";

import BunqErrorHandler from "~functions/BunqErrorHandler";
import { actions } from "./index";
import { actions as bunqMeTabsActions } from "../bunqMeTabs";
import { actions as snackbarActions } from "../snackbar";

declare let window: Window & { t: Function };

export function bunqMeTabSend(BunqJSClient: BunqJSClient, userId: number, accountId: number, description, amount, options = {}) {
    const failedMessage: string = window.t("We received the following error while creating your bunqme request");
    const successMessage: string = window.t("bunqme request created successfully!");

    return async (dispatch) => {
        dispatch(actions.isLoading());

        const batchedActions = [];
        try {
            await BunqJSClient.api.bunqMeTabs.post(userId, accountId, description, amount, options);
            // TODO: turn into a saga to open the snackbar
            batchedActions.push(snackbarActions.open({ message: successMessage }));
            // TODO: turn into a saga listening for updated tabs
            batchedActions.push(bunqMeTabsActions.setInfo({
                resetOldItems: false,
                BunqJSClient: !!BunqJSClient,
                account_id: accountId.toString(),
            }));
        } catch (error) {
            BunqErrorHandler(batchedActions, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading()]));
        }
    };
}

export function bunqMeTabPut(BunqJSClient: BunqJSClient, userId: number, accountId: number, tabId: number, status = "CANCELLED") {
    const failedMessage = window.t("We received the following error while updating your bunqme request");
    const successMessage = window.t("bunqme request status has been updated successfully!");

    return async (dispatch) => {
        dispatch(actions.isLoading());

        const batchedActions = [];
        try {
            await BunqJSClient.api.bunqMeTabs.put(userId, accountId, tabId, status);
            // TODO: turn into a saga to open the snackbar
            batchedActions.push(snackbarActions.open({ message: successMessage }));
            // TODO: move into a saga
            batchedActions.push(bunqMeTabsActions.setInfo({
                resetOldItems: false,
                BunqJSClient: !!BunqJSClient,
                account_id: accountId.toString(),
            }));
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading]));
        }
    };
}
