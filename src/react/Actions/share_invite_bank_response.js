import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export const STORED_SHARE_INVITE_BANK_RESPONSES = "STORED_SHARE_INVITE_BANK_RESPONSES"

export function shareInviteBankResponsesSetInfo(
    share_invite_bank_responses,
    BunqJSClient = false
) {
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
        BunqJSClient.Session
            .loadEncryptedData(STORED_SHARE_INVITE_BANK_RESPONSES)
            .then(data => {
                if (data && data.items) {
                    dispatch(shareInviteBankResponsesSetInfo(data.items));
                }
            })
            .catch(error => {});
    };
}

export function shareInviteBankResponsesInfoUpdate(
    BunqJSClient,
    user_id,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t(
        "We failed to load the share invite responses for this account"
    );

    return dispatch => {
        dispatch(shareInviteBankResponsesLoading());

        BunqJSClient.api.shareInviteBankResponse
            .list(user_id, options)
            .then(shareInviteBankResponses => {
                dispatch(
                    shareInviteBankResponsesSetInfo(
                        shareInviteBankResponses,
                        BunqJSClient
                    )
                );
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
