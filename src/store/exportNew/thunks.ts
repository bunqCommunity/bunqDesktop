import BunqErrorHandler from "~functions/BunqErrorHandler";
import { AppWindow } from "~app";
import { AppDispatch } from "~store/index";
import { actions } from "./index";

declare let window: AppWindow;

export function exportNew(
    user_id,
    account_id,
    statement_format,
    date_start,
    date_end,
    options = {
        regional_format: "EUROPEAN"
    }
) {
    const failedMessage = window.t("We failed to create the export for this monetary account");

    return async (dispatch: AppDispatch) => {
        dispatch(actions.isLoading());

        const batchedActions = [];
        try {
            await  BunqJSClient.api.customerStatementExport
                .post(user_id, account_id, statement_format, date_start, date_end, options);
        } catch (error) {
            BunqErrorHandler(batchedActions, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading()]));
        }
    };
}
