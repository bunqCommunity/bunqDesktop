import BunqErrorHandler from "../Helpers/BunqErrorHandler";

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
    return dispatch => {
        dispatch(exportNewLoading());

        BunqJSClient.api.customerStatementExport
            .post(
                user_id,
                account_id,
                statement_format,
                date_start,
                date_end,
                options
            )
            .then(exportCreated => {
                dispatch(exportNewNotLoading());
            })
            .catch(error => {
                dispatch(exportNewNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to create the export for this monetary account"
                );
            });
    };
}

export function exportNewLoading() {
    return { type: "EXPORT_NEW_IS_LOADING" };
}

export function exportNewNotLoading() {
    return { type: "EXPORT_NEW_IS_NOT_LOADING" };
}
