import BunqErrorHandler from "../Functions/BunqErrorHandler";

export const STORED_SHARE_INVITE_MONETARY_ACCOUNT_INQUIRIES = "BUNQDESKTOP_SHARE_INVITE_MONETARY_ACCOUNT_INQUIRIES";

export function shareInviteBankInquiriesSetInfo(
    share_invite_monetary_account_inquiries,
    account_id,
    BunqJSClient = false
) {
    return {
        type: "SHARE_INVITE_INQUIRIES_SET_INFO",
        payload: {
            BunqJSClient: BunqJSClient,
            account_id: account_id,
            share_invite_monetary_account_inquiries: share_invite_monetary_account_inquiries
        }
    };
}

export function loadStoredShareInviteBankInquiries(BunqJSClient) {
    return dispatch => {
        dispatch(shareInviteBankInquiriesLoading());
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(STORED_SHARE_INVITE_MONETARY_ACCOUNT_INQUIRIES)
            .then(data => {
                if (data && data.items) {
                    dispatch(shareInviteBankInquiriesSetInfo(data.items, data.account_id));
                }
                dispatch(shareInviteBankInquiriesNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteBankInquiriesNotLoading());
            });
    };
}

export function shareInviteMonetaryAccountInquiriesInfoUpdate(
    BunqJSClient,
    user_id,
    account_id,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the share invite inquiries for this monetary account");

    return dispatch => {
        dispatch(shareInviteBankInquiriesLoading());

        BunqJSClient.api.shareInviteMonetaryAccountInquiry
            .list(user_id, account_id, options)
            .then(shareInviteBankInquiries => {
                dispatch(shareInviteBankInquiriesSetInfo(shareInviteBankInquiries, account_id, BunqJSClient));
                dispatch(shareInviteBankInquiriesNotLoading());
            })
            .catch(error => {
                dispatch(shareInviteBankInquiriesNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function shareInviteBankInquiriesLoading() {
    return { type: "SHARE_INVITE_INQUIRIES_IS_LOADING" };
}

export function shareInviteBankInquiriesNotLoading() {
    return { type: "SHARE_INVITE_INQUIRIES_IS_NOT_LOADING" };
}

export function shareInviteBankInquiriesClear() {
    return { type: "SHARE_INVITE_INQUIRIES_CLEAR" };
}
