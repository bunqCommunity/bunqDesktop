import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { storeDecryptString } from "../Helpers/CryptoWorkerWrapper";

export const STORED_SHARE_INVITE_BANK_RESPONSES = "BUNQDESKTOP_SHARE_INVITE_BANK_RESPONSES";

export function shareInviteBankResponsesSetInfo(share_invite_bank_responses, BunqJSClient = false) {
    return {
        type: "SHARE_INVITE_RESPONSES_SET_INFO",
        payload: {
            BunqJSClient: BunqJSClient,
            share_invite_bank_responses: share_invite_bank_responses
        }
    };
}

export function loadStoredShareInviteBankResponses(BunqJSClient) {
    return dispatch => {
        dispatch(shareInviteBankResponsesLoading());
        storeDecryptString(STORED_SHARE_INVITE_BANK_RESPONSES, BunqJSClient.Session.encryptionKey)
            .then(data => {
                if (data && data.items) {
                    dispatch(shareInviteBankResponsesSetInfo(data.items));
                }
                dispatch(shareInviteBankResponsesNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteBankResponsesNotLoading());
            });
    };
}

export function shareInviteBankResponsesInfoUpdate(
    BunqJSClient,
    user_id,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the share invite responses for this account");

    return dispatch => {
        dispatch(shareInviteBankResponsesLoading());

        BunqJSClient.api.shareInviteBankResponse
            .list(user_id, options)
            .then(shareInviteBankResponses => {
                dispatch(shareInviteBankResponsesSetInfo(shareInviteBankResponses, BunqJSClient));
                dispatch(shareInviteBankResponsesNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteBankResponsesNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function shareInviteBankResponsesLoading() {
    return { type: "SHARE_INVITE_RESPONSES_IS_LOADING" };
}

export function shareInviteBankResponsesNotLoading() {
    return { type: "SHARE_INVITE_RESPONSES_IS_NOT_LOADING" };
}

export function shareInviteBankResponsesClear() {
    return { type: "SHARE_INVITE_RESPONSES_CLEAR" };
}
