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

    return dispatch => {
        dispatch(shareInviteMonetaryAccountInquiryLoading());

        BunqJSClient.api.shareInviteMonetaryAccountInquiry
            .post(userId, accountId, counterparty, shareDetail, shareStatus, {
                share_type: "STANDARD",
                ...shareOptions
            })
            .then(result => {
                dispatch(snackbarActions.open({ message: successMessage }));

                // update the payments, accounts and share list
                dispatch(shareInviteMonetaryAccountInquiriesInfoUpdate(userId, accountId));
                dispatch(shareInviteMonetaryAccountInquiryNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteMonetaryAccountInquiryNotLoading());
                // FIXME
                // BunqErrorHandler(dispatch, error, failedMessage);
            });
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

    return dispatch => {
        dispatch(shareInviteMonetaryAccountInquiryLoading());

        BunqJSClient.api.shareInviteMonetaryAccountInquiry
            .putStatus(userId, accountId, shareInviteMonetaryAccountInquiryId, status)
            .then(() => {
                dispatch(snackbarActions.open({ message: successMessage }));

                // update the payments, accounts and share list
                dispatch(shareInviteMonetaryAccountInquiriesInfoUpdate(userId, accountId));
                dispatch(shareInviteMonetaryAccountInquiryNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteMonetaryAccountInquiryNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function shareInviteMonetaryAccountInquiryLoading() {
    return { type: "SHARE_INVITE_MONETARY_ACCOUNT_INQUIRY_IS_LOADING" };
}

export function shareInviteMonetaryAccountInquiryNotLoading() {
    return { type: "SHARE_INVITE_MONETARY_ACCOUNT_INQUIRY_IS_NOT_LOADING" };
}
