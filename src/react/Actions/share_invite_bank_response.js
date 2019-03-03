import BunqErrorHandler from "../Functions/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { shareInviteBankResponsesInfoUpdate } from "./share_invite_bank_responses";

export function shareInviteBankResponseChangeStatus(BunqJSClient, userId, shareInviteBankResponseId, status) {
    const failedMessage = window.t("We received the following error while updating your connect request");
    const successMessage = window.t("Connect request was updated successfully!");

    return dispatch => {
        dispatch(shareInviteBankResponseLoading());

        BunqJSClient.api.shareInviteBankResponse
            .putStatus(userId, shareInviteBankResponseId, status)
            .then(result => {
                dispatch(openSnackbar(successMessage));

                // update the payments, accounts and share list
                dispatch(shareInviteBankResponsesInfoUpdate(BunqJSClient, userId, accountId));
                dispatch(shareInviteBankResponseNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteBankResponseNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function shareInviteBankResponseLoading() {
    return { type: "SHARE_INVITE_BANK_RESPONSE_IS_LOADING" };
}

export function shareInviteBankResponseNotLoading() {
    return { type: "SHARE_INVITE_BANK_RESPONSE_IS_NOT_LOADING" };
}
