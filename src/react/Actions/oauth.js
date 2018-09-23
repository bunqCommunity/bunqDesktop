export const OAUTH_CLIENT_DETAILS_ID = "BUNQDESKTOP_OAUTH_CLIENT_ID";
export const OAUTH_CLIENT_DETAILS_SECRET = "BUNQDESKTOP_OAUTH_CLIENT_SECRET";

export function oauthSetDetails(clientId, clientSecret) {
    return {
        type: "OAUTH_SET_DETAILS",
        payload: {
            client_id: clientId,
            client_secret: clientSecret
        }
    };
}

export function oauthClear() {
    return { type: "OAUTH_CLEAR" };
}
