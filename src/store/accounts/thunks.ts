import { ThunkAction } from "redux-thunk";
import { AppWindow } from "~app";

import BunqErrorHandler from "~functions/BunqErrorHandler";
import { STORED_ACCOUNTS } from "~misc/consts";
import MonetaryAccount from "~models/MonetaryAccount";
import { AppDispatch, BatchedActions } from "~store/index";
import { IMonetaryAccount } from "~types/MonetaryAccount";
import { actions } from "./index";
import { actions as snackbarActions } from "../snackbar";

declare let window: AppWindow;

export function loadStoredAccounts() {
    return async (dispatch) => {
        const BunqDesktopClient = window.BunqDesktopClient;
        try {
            const data = await BunqDesktopClient.storeDecrypt(STORED_ACCOUNTS);
            if (data?.items) {
                dispatch(actions.setInfo({ accounts: data.items }));
            }
        } catch (e) {
        }
    };
}

export function accountsUpdate(userId): ThunkAction<any, any, any, any> {
    const failedMessage = window.t("We failed to load your monetary accounts");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch) => {
        dispatch(actions.isLoading());
        const batchedActions = [];
        try {
            const accounts: Array<IMonetaryAccount> = (await BunqJSClient.api.monetaryAccount.list(userId)).map((account) => {
                return new MonetaryAccount(account).toPlainObject() as IMonetaryAccount;
            });
            batchedActions.push(actions.setInfo({ accounts }));
        } catch (error) {
            BunqErrorHandler(batchedActions, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading()]));
        }
    };
}

export function createAccount(
    userId,
    currency,
    description,
    dailyLimit,
    color,
    savingsGoal = '',
    accountType = "MonetaryAccountBank"
) {
    const failedMessage: string = window.t("We received the following error while creating your account");
    const successMessage: string = window.t("Account created successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch: AppDispatch) => {
        dispatch(actions.isLoading());

        let apiPromise;
        switch (accountType) {
            case "MonetaryAccountSavings":
                apiPromise = BunqJSClient.api.monetaryAccountSavings.post(
                    userId,
                    currency,
                    description,
                    dailyLimit,
                    color,
                    savingsGoal
                );
                break;
            // TODO: figure out if this still exists
            // case "MonetaryAccountJoint":
            //     apiPromise = BunqJSClient.api.monetaryAccountJoint.post(
            //         userId,
            //         currency,
            //         description,
            //         dailyLimit,
            //         color
            //     );
            //     break;
            case "MonetaryAccountBank":
            default:
                apiPromise = BunqJSClient.api.monetaryAccountBank.post(
                    userId,
                    currency,
                    description,
                    dailyLimit,
                    color
                );
                break;
        }

        const batchedActions: BatchedActions = [];
        try {
            await apiPromise;
            batchedActions.push(snackbarActions.open({ message: successMessage }));
            batchedActions.push(accountsUpdate(userId));
        } catch (error) {
            BunqErrorHandler(batchedActions, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.createAccountNotLoading]));
        }
    };
}

export function accountsUpdateImage(
    userId,
    accountId,
    attachmentId,
    accountType = "MonetaryAccountBank"
) {
    const failedMessage = window.t("We received the following error while updating the image for the monetary account");
    const successMessage = window.t("Image updated successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch) => {
        dispatch(actions.isLoading());

        const batchedActions = [];
        try {
            // make the image public
            const avatarUuid = await BunqJSClient.api.avatar.post(attachmentId);
            const putRequest = {
                avatar_uuid: avatarUuid
            };

            let apiPromise;
            switch (accountType) {
                case "MonetaryAccountSavings":
                    apiPromise = BunqJSClient.api.monetaryAccountSavings.put(userId, accountId, putRequest);
                    break;
                case "MonetaryAccountJoint":
                    apiPromise = BunqJSClient.api.monetaryAccountJoint.put(userId, accountId, putRequest);
                    break;
                case "MonetaryAccountBank":
                default:
                    apiPromise = BunqJSClient.api.monetaryAccountBank.put(userId, accountId, putRequest);
                    break;
            }

            await apiPromise;
            batchedActions.push(snackbarActions.open(successMessage));
            batchedActions.push(accountsUpdate(userId));
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.isNotLoading]));
        }
    };
}

export function accountsDeactivate(userId, accountId, reason, accountType = "MonetaryAccountBank") {
    const failedMessage = window.t("We received the following error while deactivating your account");
    const successMessage = window.t("Account deactivated successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch) => {
        dispatch(actions.updateAccountStatusLoading());

        let apiHandler = null;
        switch (accountType) {
            case "MonetaryAccountSavings":
                apiHandler = BunqJSClient.api.monetaryAccountSavings;
                break;
            case "MonetaryAccountJoint":
                apiHandler = BunqJSClient.api.monetaryAccountJoint;
                break;
            case "MonetaryAccountBank":
            default:
                apiHandler = BunqJSClient.api.monetaryAccountBank;
                break;
        }

        const batchedActions = [];
        try {
            await apiHandler.putCancel(userId, accountId, "CANCELLED", "REDEMPTION_VOLUNTARY", reason);
            batchedActions.push(snackbarActions.open({ message: successMessage }));
            batchedActions.push(accountsUpdate(userId));
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.updateAccountStatusNotLoading()]));
        }
    };
}

export function accountsUpdateSettings(
    userId,
    accountId,
    monetaryAccountSettings,
    accountType = "MonetaryAccountBank"
) {
    const failedMessage = window.t("We received the following error updating the settings for your account");
    const successMessage = window.t("Account settings updated successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch) => {
        dispatch(actions.updateAccountStatusLoading());

        let apiHandler = null;
        switch (accountType) {
            case "MonetaryAccountSavings":
                apiHandler = BunqJSClient.api.monetaryAccountSavings;
                break;
            case "MonetaryAccountJoint":
                apiHandler = BunqJSClient.api.monetaryAccountJoint;
                break;
            case "MonetaryAccountBank":
            default:
                apiHandler = BunqJSClient.api.monetaryAccountBank;
                break;
        }

        const batchedActions = [];
        try {
            await apiHandler.put(userId, accountId, monetaryAccountSettings);
            batchedActions.push(snackbarActions.open({ message: successMessage }));
            batchedActions.push(accountsUpdate(userId));
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([actions.updateAccountStatusNotLoading()]))
        }
    };
}
