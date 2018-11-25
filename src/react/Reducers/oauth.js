import store from "store";

import {
    OAUTH_CLIENT_DETAILS_ID,
    OAUTH_CLIENT_DETAILS_SECRET,
    OAUTH_SANDBOX_CLIENT_DETAILS_ID,
    OAUTH_SANDBOX_CLIENT_DETAILS_SECRET
} from "../Actions/oauth";

const storedClientId = store.get(OAUTH_CLIENT_DETAILS_ID);
const storedClientSecret = store.get(OAUTH_CLIENT_DETAILS_SECRET);
const storedSandboxClientId = store.get(OAUTH_SANDBOX_CLIENT_DETAILS_ID);
const storedSandboxClientSecret = store.get(OAUTH_SANDBOX_CLIENT_DETAILS_SECRET);

const defaultClientId = storedClientId !== undefined ? storedClientId : false;
const defaultClientSecret = storedClientSecret !== undefined ? storedClientSecret : false;
const defaultSandboxClientId =
    storedSandboxClientId !== undefined
        ? storedSandboxClientId
        : "cad17f2f7ea5ec0f36060ea5b4abde8517346afc7ffcb4969c9c2b3fa0a71a43";
const defaultSandboxClientSecret =
    storedSandboxClientSecret !== undefined
        ? storedSandboxClientSecret
        : "6931cf5fa41506f21e426a2aaa53d9b70af8e643ef97b389118a0b9ae6f0f9a2";

export const defaultState = {
    client_id: defaultClientId,
    client_secret: defaultClientSecret,
    sandbox_client_id: defaultSandboxClientId,
    sandbox_client_secret: defaultSandboxClientSecret
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "OAUTH_SET_DETAILS":
            store.set(OAUTH_CLIENT_DETAILS_ID, action.payload.client_id);
            store.set(OAUTH_CLIENT_DETAILS_SECRET, action.payload.client_secret);
            store.set(OAUTH_SANDBOX_CLIENT_DETAILS_ID, action.payload.sandbox_client_id);
            store.set(OAUTH_SANDBOX_CLIENT_DETAILS_SECRET, action.payload.sandbox_client_secret);

            return {
                ...state,
                client_id: action.payload.client_id,
                client_secret: action.payload.client_secret,
                sandbox_client_id: action.payload.sandbox_client_id,
                sandbox_client_secret: action.payload.sandbox_client_secret
            };

        case "OAUTH_CLEAR":
            store.remove(OAUTH_CLIENT_DETAILS_ID);
            store.remove(OAUTH_CLIENT_DETAILS_SECRET);
            store.remove(OAUTH_SANDBOX_CLIENT_DETAILS_ID);
            store.remove(OAUTH_SANDBOX_CLIENT_DETAILS_SECRET);
            return {
                ...defaultState
            };
    }
    return state;
};
