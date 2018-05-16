import { STORED_SHARE_INVITE_BANK_RESPONSES } from "../Actions/share_invite_bank_response";

export const defaultState = {
    share_invite_bank_responses: [],
    user_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "SHARE_INVITE_RESPONSES_SET_INFO":
            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session
                    .storeEncryptedData(
                        {
                            items: action.payload.share_invite_bank_responses
                        },
                        STORED_SHARE_INVITE_BANK_RESPONSES
                    )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                share_invite_bank_responses:
                    action.payload.share_invite_bank_responses,
                user_id: action.payload.user_id
            };

        case "SHARE_INVITE_RESPONSES_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "SHARE_INVITE_RESPONSES_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "SHARE_INVITE_RESPONSES_CLEAR":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                ...defaultState
            };
    }
    return state;
};
