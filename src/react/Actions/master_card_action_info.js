import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function masterCardActionSetInfo(
    master_card_action_info,
    account_id,
    master_card_action_id
) {
    return {
        type: "MASTER_CARD_ACTION_INFO_SET_INFO",
        payload: {
            master_card_action_info: master_card_action_info,
            master_card_action_id: master_card_action_id,
            account_id: account_id
        }
    };
}

export function masterCardActionInfoUpdate(
    BunqJSClient,
    user_id,
    account_id,
    master_card_action_id
) {
    return dispatch => {
        dispatch(masterCardActionInfoLoading());
        BunqJSClient.api.masterCardAction
            .get(user_id, account_id, master_card_action_id)
            .then(paymentInfo => {
                dispatch(
                    masterCardActionSetInfo(
                        paymentInfo,
                        account_id,
                        master_card_action_id
                    )
                );
                dispatch(masterCardActionInfoNotLoading());
            })
            .catch(error => {
                dispatch(masterCardActionInfoNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the master card payment information"
                );
            });
    };
}

export function masterCardActionInfoLoading() {
    return { type: "MASTER_CARD_ACTION_INFO_IS_LOADING" };
}

export function masterCardActionInfoNotLoading() {
    return { type: "MASTER_CARD_ACTION_INFO_IS_NOT_LOADING" };
}

export function masterCardActionInfoClear() {
    return { type: "MASTER_CARD_ACTION_INFO_CLEAR" };
}
