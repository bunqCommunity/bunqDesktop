export const OAUTH_CLIENT_DETAILS = "BUNQDESKTOP_OAUTH_CLIENT_DETAILS";

export function oauthSetDetails(clientId, clientSecret, BunqJSClient = false) {
    return {
        type: "OAUTH_SET_DETAILS",
        payload: {
            client_id: clientId,
            client_secret: clientSecret,
            BunqJSClient
        }
    };
}

export function loadOAuthDetails(BunqJSClient) {
    return dispatch => {
        BunqJSClient.Session.loadEncryptedData(OAUTH_CLIENT_DETAILS)
            .then(data => {
                if (data && data.items) {
                    dispatch(
                        oauthSetDetails(
                            data.client_id,
                            data.client_secret,
                            BunqJSClient
                        )
                    );
                }
            })
            .catch(error => {});
    };
}

export function oauthClear() {
    return { type: "OAUTH_CLEAR" };
}
