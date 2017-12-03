import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function masterCardActionsSetInfo(masterCardActions, account_id) {
    return {
        type: "MASTER_CARD_ACTIONS_SET_INFO",
        payload: {
            master_card_actions: masterCardActions,
            account_id: account_id
        }
    };
}

export function masterCardActionsUpdate(BunqJSClient, userId, accountId) {
    return dispatch => {
        dispatch(masterCardActionsLoading());
        BunqJSClient.api.masterCardAction
            .list(userId, accountId)
            .then(masterCardActions => {
                dispatch(
                    masterCardActionsSetInfo(masterCardActions, accountId)
                );
                dispatch(masterCardActionsNotLoading());
            })
            .catch(error => {
                dispatch(masterCardActionsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while loading your master card payments"
                );
            });
    };
}

export function masterCardActionsLoading() {
    return { type: "MASTER_CARD_ACTIONS_IS_LOADING" };
}

export function masterCardActionsNotLoading() {
    return { type: "MASTER_CARD_ACTIONS_IS_NOT_LOADING" };
}

export function masterCardActionsClear() {
    return { type: "MASTER_CARD_ACTIONS_CLEAR" };
}
