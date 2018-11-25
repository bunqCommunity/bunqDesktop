import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { bunqMeTabsUpdate } from "./bunq_me_tabs";

export function bunqMeTabSend(BunqJSClient, userId, accountId, description, amount, options = {}) {
    const failedMessage = window.t("We received the following error while creating your bunqme request");
    const successMessage = window.t("bunqme request created successfully!");

    return dispatch => {
        dispatch(bunqMeTabLoading());
        BunqJSClient.api.bunqMeTabs
            .post(userId, accountId, description, amount, options)
            .then(result => {
                dispatch(openSnackbar(successMessage));
                dispatch(bunqMeTabsUpdate(BunqJSClient, userId, parseInt(accountId)));
                dispatch(bunqMeTabNotLoading());
            })
            .catch(error => {
                dispatch(bunqMeTabNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function bunqMeTabPut(BunqJSClient, userId, accountId, tabId, status = "CANCELLED") {
    const failedMessage = window.t("We received the following error while updating your bunqme request");
    const successMessage = window.t("bunqme request status has been updated successfully!");

    return dispatch => {
        dispatch(bunqMeTabLoading());
        BunqJSClient.api.bunqMeTabs
            .put(userId, accountId, tabId, status)
            .then(result => {
                dispatch(openSnackbar(successMessage));
                dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId));
                dispatch(bunqMeTabNotLoading());
            })
            .catch(error => {
                dispatch(bunqMeTabNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function bunqMeTabLoading() {
    return { type: "BUNQ_ME_TAB_IS_LOADING" };
}

export function bunqMeTabNotLoading() {
    return { type: "BUNQ_ME_TAB_IS_NOT_LOADING" };
}
