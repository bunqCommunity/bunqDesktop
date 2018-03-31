import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function exportsSetInfo(
    exports,
    user_id,
    account_id
) {
    return {
        type: "EXPORTS_SET_INFO",
        payload: {
            exports,
            user_id,
            account_id
        }
    };
}

export function exportInfoUpdate(
    BunqJSClient,
    user_id,
    account_id,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(exportsLoading());

        BunqJSClient.api.customerStatementExport
            .list(user_id, account_id, options)
            .then(exports => {

                dispatch(
                    exportsSetInfo(
                        exports,
                        user_id,
                        account_id
                    )
                );
                dispatch(exportsNotLoading());
            })
            .catch(error => {
                dispatch(exportsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the exports for this monetary account"
                );
            });
    };
}

export function exportsLoading() {
    return { type: "EXPORTS_IS_LOADING" };
}

export function exportsNotLoading() {
    return { type: "EXPORTS_IS_NOT_LOADING" };
}

export function exportsClear() {
    return { type: "EXPORTS_CLEAR" };
}
