import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { shareInviteBankInquiriesInfoUpdate } from "./share_invite_bank_inquiries";

export function shareInviteBankInquirySend(
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
        dispatch(shareInviteBankInquiryLoading());

        BunqJSClient.api.shareInviteBankInquiry
            .post(userId, accountId, counterparty, shareDetail, shareStatus, {
                share_type: "STANDARD",
                ...shareOptions
            })
            .then(result => {
                dispatch(openSnackbar(successMessage));

                // update the payments, accounts and share list
                dispatch(shareInviteBankInquiriesInfoUpdate(BunqJSClient, userId, accountId));
                dispatch(shareInviteBankInquiryNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteBankInquiryNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function shareInviteBankInquiryLoading() {
    return { type: "SHARE_INVITE_BANK_INQUIRY_IS_LOADING" };
}

export function shareInviteBankInquiryNotLoading() {
    return { type: "SHARE_INVITE_BANK_INQUIRY_IS_NOT_LOADING" };
}
