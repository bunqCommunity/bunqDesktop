import BunqErrorHandler from "../Functions/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { shareInviteMonetaryAccountResponsesInfoUpdate } from "./share_invite_monetary_account_responses";

export function shareInviteMonetaryAccountResponseChangeStatus(
    BunqJSClient,
    userId,
    shareInviteMonetaryAccountResponseId,
    status
) {
    const failedMessage = window.t("We received the following error while updating your connect request");
    const successMessage = window.t("Connect request was updated successfully!");

    return dispatch => {
        dispatch(shareInviteMonetaryAccountResponseLoading());

        BunqJSClient.api.shareInviteMonetaryAccountResponse
            .putStatus(userId, shareInviteMonetaryAccountResponseId, status)
            .then(result => {
                dispatch(openSnackbar(successMessage));

                // update the payments, accounts and share list
                dispatch(shareInviteMonetaryAccountResponsesInfoUpdate(BunqJSClient, userId, accountId));
                dispatch(shareInviteMonetaryAccountResponseNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteMonetaryAccountResponseNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function shareInviteMonetaryAccountResponseLoading() {
    return { type: "SHARE_INVITE_MONETARY_ACCOUNT_RESPONSE_IS_LOADING" };
}

export function shareInviteMonetaryAccountResponseNotLoading() {
    return { type: "SHARE_INVITE_MONETARY_ACCOUNT_RESPONSE_IS_NOT_LOADING" };
}
