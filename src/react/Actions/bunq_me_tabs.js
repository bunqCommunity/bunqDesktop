import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function bunqMeTabsSetInfo(bunq_me_tabs, account_id) {
    return {
        type: "BUNQ_ME_TABS_SET_INFO",
        payload: {
            bunq_me_tabs: bunq_me_tabs,
            account_id: account_id
        }
    };
}

export function bunqMeTabsUpdate(BunqJSClient, user_id, account_id) {
    return dispatch => {
        dispatch(bunqMeTabsLoading());
        BunqJSClient.api.bunqMeTabs
            .list(user_id, account_id)
            .then(bunqMeTabs => {
                dispatch(bunqMeTabsSetInfo(bunqMeTabs, account_id));
                dispatch(bunqMeTabsNotLoading());
            })
            .catch(err => {
                dispatch(bunqMeTabsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the payments for this monetary account"
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
