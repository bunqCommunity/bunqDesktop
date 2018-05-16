import { STORED_SHARE_INVITE_BANK_INQUIRIES } from "../Actions/share_invite_bank_inquiry";

export const defaultState = {
    share_invite_bank_inquiries: [],
    user_id: false,
    account_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "SHARE_INVITE_INQUIRIES_SET_INFO":
            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: action.payload.share_invite_bank_inquiries,
                            account_id: action.payload.account_id
                        },
                        STORED_SHARE_INVITE_BANK_INQUIRIES
                    )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                share_invite_bank_inquiries:
                    action.payload.share_invite_bank_inquiries,
                account_id: action.payload.account_id,
                user_id: action.payload.user_id
            };

        case "SHARE_INVITE_INQUIRIES_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "SHARE_INVITE_INQUIRIES_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "SHARE_INVITE_INQUIRIES_CLEAR":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                ...defaultState
            };
    }
    return state;
};
