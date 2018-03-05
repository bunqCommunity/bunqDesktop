import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function bunqMeTabsSetInfo(
    bunqMeTabs,
    account_id,
    resetOldItems = false,
    BunqJSClient = false
) {
    const type = resetOldItems
        ? "BUNQ_ME_TABS_SET_INFO"
        : "BUNQ_ME_TABS_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            bunqMeTabs,
            account_id
        }
    };
}

export function bunqMeTabsUpdate(
    BunqJSClient,
    user_id,
    accountId,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(bunqMeTabsLoading());
        BunqJSClient.api.bunqMeTabs
            .list(user_id, accountId, options)
            .then(bunqMeTabs => {
                dispatch(
                    bunqMeTabsSetInfo(
                        bunqMeTabs,
                        accountId,
                        false,
                        BunqJSClient
                    )
                );
                dispatch(bunqMeTabsNotLoading());
            })
            .catch(error => {
                dispatch(bunqMeTabsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the bunq.me requests for this monetary account"
                );
            });
    };
}

export function bunqMeTabsLoading() {
    return { type: "BUNQ_ME_TABS_IS_LOADING" };
}

export function bunqMeTabsNotLoading() {
    return { type: "BUNQ_ME_TABS_IS_NOT_LOADING" };
}

export function bunqMeTabsClear() {
    return { type: "BUNQ_ME_TABS_CLEAR" };
}
