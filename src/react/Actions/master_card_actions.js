import BunqErrorHandler from "../Functions/BunqErrorHandler";
import MasterCardAction from "../Models/MasterCardAction";

export const STORED_MASTER_CARD_ACTIONS = "BUNQDESKTOP_STORED_MASTER_CARD_ACTIONS";

export function masterCardActionsSetInfo(masterCardActions, account_id, resetOldItems = false, BunqJSClient = false) {
    const type = resetOldItems ? "MASTER_CARD_ACTIONS_SET_INFO" : "MASTER_CARD_ACTIONS_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            masterCardActions,
            account_id
        }
    };
}

export function loadStoredMasterCardActions(BunqJSClient) {
    return dispatch => {
        dispatch(masterCardActionsLoading());
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(STORED_MASTER_CARD_ACTIONS)
            .then(data => {
                if (data && data.items) {
                    // turn plain objects into Model objects
                    const masterCardActionsNew = data.items.map(item => new MasterCardAction(item));
                    dispatch(masterCardActionsSetInfo(masterCardActionsNew, data.account_id));
                }
                dispatch(masterCardActionsNotLoading());
            })
            .catch(error => {
                dispatch(masterCardActionsNotLoading());
            });
    };
}

export function masterCardActionsUpdate(
    BunqJSClient,
    userId,
    accountId,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We received the following error while loading your mastercard payments");

    return dispatch => {
        dispatch(masterCardActionsLoading());
        BunqJSClient.api.masterCardAction
            .list(userId, accountId, options)
            .then(masterCardActions => {
                // turn plain objects into Model objects
                const masterCardActionsNew = masterCardActions.map(item => new MasterCardAction(item));

                dispatch(masterCardActionsSetInfo(masterCardActionsNew, accountId, false, BunqJSClient));
                dispatch(masterCardActionsNotLoading());
            })
            .catch(error => {
                dispatch(masterCardActionsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
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
