import BunqErrorHandler from "~functions/BunqErrorHandler";

export const STORED_SHARE_INVITE_MONETARY_ACCOUNT_INQUIRIES = "BUNQDESKTOP_SHARE_INVITE_MONETARY_ACCOUNT_INQUIRIES";

export function shareInviteBankInquiriesSetInfo(
    share_invite_monetary_account_inquiries,
    account_id,
) {
    return {
        type: "SHARE_INVITE_INQUIRIES_SET_INFO",
        payload: {
            account_id: account_id,
            share_invite_monetary_account_inquiries: share_invite_monetary_account_inquiries
        }
    };
}

export function loadStoredShareInviteBankInquiries() {
    return async (dispatch) => {
        const BunqDesktopClient = window.BunqDesktopClient;

        dispatch(shareInviteBankInquiriesLoading());

        const batchedActions = [];
        try {
            const data = await BunqDesktopClient.storeDecrypt(STORED_SHARE_INVITE_MONETARY_ACCOUNT_INQUIRIES);
            if (data && data.items) {
                batchedActions.push(shareInviteBankInquiriesSetInfo(data.items, data.account_id));
            }
        } finally {
            dispatch(batchedActions.concat([shareInviteBankInquiriesNotLoading()]));
        }
    };
}

export function shareInviteMonetaryAccountInquiriesInfoUpdate(
    user_id,
    account_id,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the share invite inquiries for this monetary account");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return async (dispatch) => {
        dispatch(shareInviteBankInquiriesLoading());

        const batchedActions = [];
        try {
            const shareInviteBankInquiries = await BunqJSClient.api.shareInviteMonetaryAccountInquiry.list(user_id, account_id, options);
            batchedActions.push(shareInviteBankInquiriesSetInfo(shareInviteBankInquiries, account_id, BunqJSClient));
        } catch (error) {
            BunqErrorHandler(batchedActions, error, failedMessage);
        } finally {
            dispatch(batchedActions.concat([shareInviteBankInquiriesNotLoading()]));
        }
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
