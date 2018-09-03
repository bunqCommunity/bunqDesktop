import store from "store";

import { OAUTH_CLIENT_DETAILS } from "../Actions/oauth";

export const defaultState = {
    client_id: false,
    client_secret: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "OAUTH_SET_DETAILS":
            // store the data if we have access to the bunqjsclient
            if (action.payload.BunqJSClient) {
                action.payload.BunqJSClient.Session.storeEncryptedData(
                    {
                        client_id: action.payload.client_id,
                        client_secret: action.payload.client_secret
                    },
                    OAUTH_CLIENT_DETAILS
                )
                    .then(() => {})
                    .catch(() => {});
            }

            return {
                ...state,
                client_id: action.payload.client_id,
                client_secret: action.payload.client_secret
            };

        case "OAUTH_CLEAR":
        case "REGISTRATION_LOG_OUT":
        case "REGISTRATION_CLEAR_PRIVATE_DATA":
        case "REGISTRATION_CLEAR_USER_INFO":
            store.remove(OAUTH_CLIENT_DETAILS);
            return {
                ...defaultState
            };
    }
    return state;
};
