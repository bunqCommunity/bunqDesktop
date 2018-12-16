import BunqErrorHandler from "../Functions/BunqErrorHandler";
import BunqMeTab from "../Models/BunqMeTab.ts";

export const STORED_BUNQ_ME_TABS = "BUNQDESKTOP_STORED_BUNQ_ME_TABS";

export function bunqMeTabsSetInfo(bunqMeTabs, account_id, resetOldItems = false, BunqJSClient = false) {
    const type = resetOldItems ? "BUNQ_ME_TABS_SET_INFO" : "BUNQ_ME_TABS_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            bunqMeTabs,
            account_id
        }
    };
}

export function loadStoredBunqMeTabs(BunqJSClient) {
    return dispatch => {
        dispatch(bunqMeTabsLoading());
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(STORED_BUNQ_ME_TABS)
            .then(data => {
                if (data && data.items) {
                    const bunqMeTabsNew = data.items.map(item => new BunqMeTab(item));
                    dispatch(bunqMeTabsSetInfo(bunqMeTabsNew, data.account_id));
                }

                dispatch(bunqMeTabsNotLoading());
            })
            .catch(error => {
                dispatch(bunqMeTabsNotLoading());
            });
    };
}

export function bunqMeTabsUpdate(
    BunqJSClient,
    user_id,
    accountId,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the bunqme requests for this monetary account");

    return dispatch => {
        dispatch(bunqMeTabsLoading());
        BunqJSClient.api.bunqMeTabs
            .list(user_id, accountId, options)
            .then(bunqMeTabs => {
                const bunqMeTabsNew = bunqMeTabs.map(item => new BunqMeTab(item));
                dispatch(bunqMeTabsSetInfo(bunqMeTabsNew, accountId, false, BunqJSClient));
                dispatch(bunqMeTabsNotLoading());
            })
            .catch(error => {
                dispatch(bunqMeTabsNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
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
