import { AppWindow } from "~app";
import { STORED_BUNQ_ME_TABS } from "~misc/consts";
import BunqDesktopClient from "~components/BunqDesktopClient";
import BunqErrorHandler from "~functions/BunqErrorHandler";
import BunqMeTab from "~models/BunqMeTab";
import { actions } from "./index";

declare let window: AppWindow;

export function loadStoredBunqMeTabs() {
    return async (dispatch) => {
        dispatch(actions.isLoading());
        const BunqDesktopClient = window.BunqDesktopClient;

        const batchedActions = [];
        try {
            const data = await BunqDesktopClient.storeDecrypt(STORED_BUNQ_ME_TABS);
            if (data && data.items) {
                const bunqMeTabsNew = data.items.map(item => new BunqMeTab(item));
                batchedActions.push(actions.setInfo({ bunqMeTabs: bunqMeTabsNew, account_id: data.account_id }));
            }
        } catch (e) {
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading()]));
        }
    };
}

export function bunqMeTabsUpdate(
    user_id,
    accountId,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the bunqme requests for this monetary account");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch) => {
        dispatch(actions.isLoading());

        const batchedActions = [];
        try {
            const bunqMeTabs = await BunqJSClient.api.bunqMeTabs.list(user_id, accountId, options);
            const bunqMeTabsNew = bunqMeTabs.map(item => new BunqMeTab(item));
            batchedActions.push(actions.setInfo({
                bunqMeTabs: bunqMeTabsNew,
                account_id: accountId,
                resetOldItems: false,
            }));
            batchedActions.push(actions.isNotLoading());
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading()]));
        }
    };
}
