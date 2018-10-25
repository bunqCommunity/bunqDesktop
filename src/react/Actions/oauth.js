export const OAUTH_CLIENT_DETAILS_ID = "BUNQDESKTOP_OAUTH_CLIENT_ID";
export const OAUTH_CLIENT_DETAILS_SECRET = "BUNQDESKTOP_OAUTH_CLIENT_SECRET";

export const OAUTH_SANDBOX_CLIENT_DETAILS_ID = "BUNQDESKTOP_OAUTH_SANDBOX_CLIENT_ID";
export const OAUTH_SANDBOX_CLIENT_DETAILS_SECRET = "BUNQDESKTOP_OAUTH_SANDBOX_CLIENT_SECRET";

export function oauthSetDetails(clientId, clientSecret, sandboxClientId = false, sandboxClientSecret = false) {
    return {
        type: "OAUTH_SET_DETAILS",
        payload: {
            client_id: clientId,
            client_secret: clientSecret,

            sandbox_client_id: sandboxClientId,
            sandbox_client_secret: sandboxClientSecret
        }
    };
}

export function oauthClear() {
    return { type: "OAUTH_CLEAR" };
}
