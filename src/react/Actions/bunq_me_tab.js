import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { bunqMeTabsUpdate } from "./bunq_me_tabs";

export function bunqMeTabSend(
    BunqJSClient,
    userId,
    accountId,
    description,
    amount,
    options = {}
) {
    return dispatch => {
        dispatch(bunqMeTabLoading());
        BunqJSClient.api.bunqMeTabs
            .post(userId, accountId, description, amount, options)
            .then(result => {
                dispatch(openSnackbar("Bunq.me request created successfully!"));
                dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId));
                dispatch(bunqMeTabNotLoading());
            })
            .catch(error => {
                dispatch(bunqMeTabNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while creating your Bunq.me request"
                );
            });
    };
}

export function bunqMeTabPut(
    BunqJSClient,
    userId,
    accountId,
    tabId,
    status = "CANCELLED"
) {
    return dispatch => {
        dispatch(bunqMeTabLoading());
        BunqJSClient.api.bunqMeTabs
            .put(userId, accountId, tabId, status)
            .then(result => {
                dispatch(openSnackbar("Bunq.me request status has been updated successfully!"));
                dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId));
                dispatch(bunqMeTabNotLoading());
            })
            .catch(error => {
                dispatch(bunqMeTabNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while updating your Bunq.me request"
                );
            });
    };
}

export function bunqMeTabLoading() {
    return { type: "BUNQ_ME_TAB_IS_LOADING" };
}

export function bunqMeTabNotLoading() {
    return { type: "BUNQ_ME_TAB_IS_NOT_LOADING" };
}
