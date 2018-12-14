import BunqErrorHandler from "../Functions/BunqErrorHandler";

export function exportNew(
    BunqJSClient,
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

    return dispatch => {
        dispatch(exportNewLoading());

        BunqJSClient.api.customerStatementExport
            .post(user_id, account_id, statement_format, date_start, date_end, options)
            .then(exportCreated => {
                dispatch(exportNewNotLoading());
            })
            .catch(error => {
                dispatch(exportNewNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function exportNewLoading() {
    return { type: "EXPORT_NEW_IS_LOADING" };
}

export function exportNewNotLoading() {
    return { type: "EXPORT_NEW_IS_NOT_LOADING" };
}
