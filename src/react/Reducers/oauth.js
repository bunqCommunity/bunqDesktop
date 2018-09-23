import store from "store";

import {
    OAUTH_CLIENT_DETAILS_ID,
    OAUTH_CLIENT_DETAILS_SECRET
} from "../Actions/oauth";

const storedClientId = store.get(OAUTH_CLIENT_DETAILS_ID);
const storedClientSecret = store.get(OAUTH_CLIENT_DETAILS_SECRET);

const defaultClientId = storedClientId !== undefined ? storedClientId : false;
const defaultClientSecret =
    storedClientSecret !== undefined ? storedClientSecret : false;

export const defaultState = {
    client_id: defaultClientId,
    client_secret: defaultClientSecret
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "OAUTH_SET_DETAILS":
            store.set(OAUTH_CLIENT_DETAILS_ID, action.payload.client_id);
            store.set(
                OAUTH_CLIENT_DETAILS_SECRET,
                action.payload.client_secret
            );

            return {
                ...state,
                client_id: action.payload.client_id,
                client_secret: action.payload.client_secret
            };

        case "OAUTH_CLEAR":
            store.remove(OAUTH_CLIENT_DETAILS_ID);
            store.remove(OAUTH_CLIENT_DETAILS_SECRET);
            return {
                ...defaultState
            };
    }
    return state;
};
