import store from "store";
import { STORED_SHARE_INVITE_MONETARY_ACCOUNT_RESPONSES } from "../Actions/share_invite_monetary_account_responses";
import { storeEncryptString } from "../Functions/Crypto/CryptoWorkerWrapper";

export const defaultState = {
    share_invite_monetary_account_responses: [],
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "SHARE_INVITE_RESPONSES_SET_INFO":
            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                const BunqDesktopClient = window.BunqDesktopClient;
                BunqDesktopClient.storeEncrypt(
                    {
                        items: action.payload.share_invite_monetary_account_responses
                    },
                    STORED_SHARE_INVITE_MONETARY_ACCOUNT_RESPONSES
                )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                share_invite_monetary_account_responses: action.payload.share_invite_monetary_account_responses
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
            const BunqDesktopClient = window.BunqDesktopClient;
            BunqDesktopClient.storeRemove(STORED_SHARE_INVITE_MONETARY_ACCOUNT_RESPONSES);
            return {
                ...defaultState
            };
    }
    return state;
};
