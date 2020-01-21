import BunqErrorHandler from "~functions/BunqErrorHandler";
import { shareInviteMonetaryAccountInquiriesInfoUpdate } from "./share_invite_monetary_account_inquiries";
import { actions as snackbarActions } from "~store/snackbar";

export function shareInviteMonetaryAccountInquirySend(
    userId,
    accountId,
    counterparty,
    shareDetail,
    shareOptions,
    shareStatus = "PENDING"
) {
    const failedMessage = window.t("We received the following error while sending your connect request");
    const successMessage = window.t("Connect request was sent successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch) => {
        dispatch(shareInviteMonetaryAccountInquiryLoading());

        const batchedActions = [];
        try {
            await BunqJSClient.api.shareInviteMonetaryAccountInquiry.post(userId, accountId, counterparty, shareDetail, shareStatus, {
                share_type: "STANDARD",
                ...shareOptions
            });

            batchedActions.push(snackbarActions.open({ message: successMessage }));
            // update the payments, accounts and share list
            batchedActions.push(shareInviteMonetaryAccountInquiriesInfoUpdate(userId, accountId));
        } catch (error) {
            BunqErrorHandler(batchedActions, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([shareInviteMonetaryAccountInquiryNotLoading()]));

        }
    };
}

export function shareInviteMonetaryAccountInquiryChangeStatus(
    userId,
    accountId,
    shareInviteMonetaryAccountInquiryId,
    status
) {
    const failedMessage = window.t("We received the following error while updating your connect request");
    const successMessage = window.t("Connect request was updated successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch) => {
        dispatch(shareInviteMonetaryAccountInquiryLoading());

        const batchedActions = [];
        try {
            await BunqJSClient.api.shareInviteMonetaryAccountInquiry.putStatus(userId, accountId, shareInviteMonetaryAccountInquiryId, status);
            batchedActions.push(snackbarActions.open({ message: successMessage }));
            // update the payments, accounts and share list
            batchedActions.push(shareInviteMonetaryAccountInquiriesInfoUpdate(userId, accountId));
        } catch (error) {
            BunqErrorHandler(dispatch, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([shareInviteMonetaryAccountInquiryNotLoading()]))
        }
    };
}

export function shareInviteMonetaryAccountInquiryLoading() {
    return { type: "SHARE_INVITE_MONETARY_ACCOUNT_INQUIRY_IS_LOADING" };
}

export function shareInviteMonetaryAccountInquiryNotLoading() {
    return { type: "SHARE_INVITE_MONETARY_ACCOUNT_INQUIRY_IS_NOT_LOADING" };
}
