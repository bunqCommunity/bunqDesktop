import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function bunqMeTabsSetInfo(
    bunq_me_tabs,
    account_id,
    newer = false,
    older = false
) {
    // get the newer and older id from the list
    const { 0: newerItem, [bunq_me_tabs.length - 1]: olderItem } = bunq_me_tabs;

    let type = "BUNQ_ME_TABS_SET_INFO";
    if (newer !== false) {
        type = "BUNQ_ME_TABS_ADD_NEWER_INFO";
    } else if (older !== false) {
        type = "BUNQ_ME_TABS_ADD_OLDER_INFO";
    }

    return {
        type: type,
        payload: {
            bunq_me_tabs,
            account_id,
            newer_id: newerItem ? newerItem.BunqMeTab.id : newer,
            older_id: olderItem ? olderItem.BunqMeTab.id : older
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
                // if we have a newer/older id we need to trigger a different event
                if (options.newer_id && options.newer_id !== false) {
                    dispatch(
                        bunqMeTabsSetInfo(bunqMeTabs, accountId, options.newer_id, false)
                    );
                } else if (options.older_id && options.older_id !== false) {
                    dispatch(
                        bunqMeTabsSetInfo(bunqMeTabs, accountId, false, options.older_id)
                    );
                } else {
                    dispatch(bunqMeTabsSetInfo(bunqMeTabs, accountId));
                }

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
