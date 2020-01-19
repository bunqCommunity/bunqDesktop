import BunqErrorHandler from "../Functions/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { shareInviteMonetaryAccountInquiriesInfoUpdate } from "./share_invite_monetary_account_inquiries";

export function shareInviteMonetaryAccountInquirySend(
    BunqJSClient,
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
                dispatch(openSnackbar(successMessage));

                // update the payments, accounts and share list
                dispatch(shareInviteMonetaryAccountInquiriesInfoUpdate(BunqJSClient, userId, accountId));
                dispatch(shareInviteMonetaryAccountInquiryNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteMonetaryAccountInquiryNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function shareInviteMonetaryAccountInquiryChangeStatus(
    BunqJSClient,
    userId,
    accountId,
    shareInviteMonetaryAccountInquiryId,
    status
) {
    const failedMessage = window.t("We received the following error while updating your connect request");
    const successMessage = window.t("Connect request was updated successfully!");

    return dispatch => {
        dispatch(shareInviteMonetaryAccountInquiryLoading());

        BunqJSClient.api.shareInviteMonetaryAccountInquiry
            .putStatus(userId, accountId, shareInviteMonetaryAccountInquiryId, status)
            .then(result => {
                dispatch(openSnackbar(successMessage));

                // update the payments, accounts and share list
                dispatch(shareInviteMonetaryAccountInquiriesInfoUpdate(BunqJSClient, userId, accountId));
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
