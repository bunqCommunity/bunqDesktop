import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function masterCardActionsSetInfo(
    master_card_actions,
    account_id,
    newer = false,
    older = false
) {
    // get the newer and older id from the list
    const {
        0: newerItem,
        [master_card_actions.length - 1]: olderItem
    } = master_card_actions;

    let type = "MASTER_CARD_ACTIONS_SET_INFO";
    if (newer !== false) {
        type = "MASTER_CARD_ACTIONS_ADD_NEWER_INFO";
    } else if (older !== false) {
        type = "MASTER_CARD_ACTIONS_ADD_OLDER_INFO";
    }

    return {
        type: type,
        payload: {
            master_card_actions,
            account_id,
            newer_id: newerItem ? newerItem.MasterCardAction.id : newer,
            older_id: olderItem ? olderItem.MasterCardAction.id : older
        }
    };
}

export function masterCardActionsUpdate(
    BunqJSClient,
    userId,
    accountId,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(masterCardActionsLoading());
        BunqJSClient.api.masterCardAction
            .list(userId, accountId, options)
            .then(masterCardActions => {
                // if we have a newer/older id we need to trigger a different event
                if (options.newer_id && options.newer_id !== false) {
                    dispatch(
                        masterCardActionsSetInfo(
                            masterCardActions,
                            accountId,
                            options.newer_id,
                            false
                        )
                    );
                } else if (options.older_id && options.older_id !== false) {
                    dispatch(
                        masterCardActionsSetInfo(
                            masterCardActions,
                            accountId,
                            false,
                            options.older_id
                        )
                    );
                } else {
                    dispatch(
                        masterCardActionsSetInfo(masterCardActions, accountId)
                    );
                }

                dispatch(masterCardActionsNotLoading());
            })
            .catch(error => {
                console.error(error);
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
