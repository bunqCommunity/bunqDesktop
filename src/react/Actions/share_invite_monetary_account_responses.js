import BunqErrorHandler from "../Functions/BunqErrorHandler";

export const STORED_SHARE_INVITE_MONETARY_ACCOUNT_RESPONSES = "BUNQDESKTOP_SHARE_INVITE_MONETARY_ACCOUNT_RESPONSES";

export function shareInviteMonetaryAccountResponsesSetInfo(
    share_invite_monetary_account_responses,
    BunqJSClient = false
) {
    return {
        type: "SHARE_INVITE_RESPONSES_SET_INFO",
        payload: {
            BunqJSClient: BunqJSClient,
            share_invite_monetary_account_responses: share_invite_monetary_account_responses
        }
    };
}

export function loadStoredShareInviteMonetaryAccountResponses(BunqJSClient) {
    return dispatch => {
        dispatch(shareInviteMonetaryAccountResponsesLoading());
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(STORED_SHARE_INVITE_MONETARY_ACCOUNT_RESPONSES)
            .then(data => {
                if (data && data.items) {
                    dispatch(shareInviteMonetaryAccountResponsesSetInfo(data.items));
                }
                dispatch(shareInviteMonetaryAccountResponsesNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteMonetaryAccountResponsesNotLoading());
            });
    };
}

export function shareInviteMonetaryAccountResponsesInfoUpdate(
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
        dispatch(shareInviteMonetaryAccountResponsesLoading());

        BunqJSClient.api.shareInviteMonetaryAccountResponse
            .list(user_id, options)
            .then(shareInviteMonetaryAccountResponses => {
                dispatch(shareInviteMonetaryAccountResponsesSetInfo(shareInviteMonetaryAccountResponses, BunqJSClient));
                dispatch(shareInviteMonetaryAccountResponsesNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteMonetaryAccountResponsesNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function shareInviteMonetaryAccountResponsesLoading() {
    return { type: "SHARE_INVITE_RESPONSES_IS_LOADING" };
}

export function shareInviteMonetaryAccountResponsesNotLoading() {
    return { type: "SHARE_INVITE_RESPONSES_IS_NOT_LOADING" };
}

export function shareInviteMonetaryAccountResponsesClear() {
    return { type: "SHARE_INVITE_RESPONSES_CLEAR" };
}
