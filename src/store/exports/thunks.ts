import { AppWindow } from "~app";
import BunqErrorHandler from "~functions/BunqErrorHandler";
import { AppDispatch, BatchedActions } from "~store/index";
import { actions } from "./index";

declare let window: AppWindow;

export function exportInfoUpdate(
    user_id,
    account_id,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the exports for this monetary account");

    return async (dispatch: AppDispatch) => {
        dispatch(actions.isLoading());

        const batchedActions: BatchedActions = [];
        try {
            const exports = BunqJSClient.api.customerStatementExport.list(user_id, account_id, options);
            dispatch(actions.setInfo({ exports, user_id, account_id }));
        } catch (error) {
            BunqErrorHandler(batchedActions, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading]));
        }
    };
}
