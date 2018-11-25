import url from "url";
import { BrowserWindow, ipcMain } from "electron";

// google oauth settings
const clientId = "735593750948-9ktjprrnvb8l827d6216grhrctrismp4.apps.googleusercontent.com";
const state = 123412341;
const responseType = "token";
const redirectUrl = "http://localhost:1234/oauth2/callback";
const scope = "https://www.googleapis.com/auth/contacts.readonly";
const prompt = "select_account";

// format the url
const oauthGoogleUrl = url.format({
    pathname: "//accounts.google.com/o/oauth2/v2/auth",
    protocol: "https",
    query: {
        scope: scope,
        prompt: prompt,
        included_granted_scopes: true,
        state: state,
        redirect_uri: redirectUrl,
        response_type: responseType,
        client_id: clientId
    }
});

// office oauth settings
const officeClientId = "47c12ea7-5625-46a5-a9ad-5c1313fa263e";
const officeResponseType = "id_token token";
const officeRedirectUrl = "http://localhost:1234/oauth2/callback";
const officeScope = "openid user.read contacts.read contacts.read.shared";
const officeResponseMode = "fragment";
const officeState = 123412341;
const officeNonce = "23vr0qn73";

// format the url
const oauthOffice365Url = url.format({
    pathname: "//login.microsoftonline.com/common/oauth2/v2.0/authorize",
    protocol: "https",
    query: {
        client_id: officeClientId,
        response_type: officeResponseType,
        redirect_uri: officeRedirectUrl,
        scope: officeScope,
        response_mode: officeResponseMode,
        state: officeState,
        nonce: officeNonce
    }
});

const createOauthWindow = (window, url) => {
    const consentWindow = new BrowserWindow({
        width: 900,
        height: 750,
        show: false,
        modal: true,
        parent: window,
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false
        }
    });
    consentWindow.loadURL(url);
    consentWindow.show();

    return consentWindow;
};

export default (window, log) => {
    ipcMain.on("open-bunq-oauth", (event, data) => {
        const consentWindow = createOauthWindow(window, data.targetUrl);

        const handleUrl = receivedUrl => {
            // get url data
            const parsedUrl = url.parse(receivedUrl);

            // check if we reached callback url
            if (parsedUrl.hostname !== "localhost") {
                // not a callback page
                return;
            }

            // parse the fragment params
            const params = {};
            const regex = /([^&=]+)=([^&]*)/g;
            let m;
            while ((m = regex.exec(parsedUrl.query))) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                // Try to exchange the param values for an access token.
            }

            // check if we received an access token
            if (params.code) {
                log.debug("Received OAuth code: " + params.code.substring(0, 8));

                // send data to renderer view
                window.webContents.send("received-oauth-bunq-code", params.code);
            } else {
                window.webContents.send("received-oauth-failed");
            }
            consentWindow.destroy();
        };

        // check if the page changed and we received a valid url
        consentWindow.webContents.on("will-navigate", function(event, receivedUrl) {
            handleUrl(receivedUrl);
        });

        consentWindow.webContents.on("did-get-redirect-request", function(event, oldUrl, newUrl) {
            handleUrl(newUrl);
        });
    });

    ipcMain.on("open-google-oauth", event => {
        const consentWindow = createOauthWindow(window, oauthGoogleUrl);

        const handleUrl = receivedUrl => {
            // get url data
            const parsedUrl = url.parse(receivedUrl);

            // check if we reached callback url
            if (parsedUrl.hostname !== "localhost") {
                // not a callback page
                return;
            }

            // parse the fragment params
            const params = {};
            const regex = /([^&=]+)=([^&]*)/g;
            let m;
            while ((m = regex.exec(parsedUrl.hash))) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                // Try to exchange the param values for an access token.
            }

            // check if we received an access token
            if (params.access_token) {
                // send data to renderer view
                window.webContents.send("received-oauth-google-access-token", params.access_token);
            } else {
                window.webContents.send("received-oauth-failed");
            }
            consentWindow.destroy();
        };

        // check if the page changed and we received a valid url
        consentWindow.webContents.on("will-navigate", function(event, receivedUrl) {
            handleUrl(receivedUrl);
        });

        consentWindow.webContents.on("did-get-redirect-request", function(event, oldUrl, newUrl) {
            handleUrl(newUrl);
        });
    });

    ipcMain.on("open-office-365-oauth", event => {
        const consentWindow = createOauthWindow(window, oauthOffice365Url);

        const handleUrl = receivedUrl => {
            // get url data
            const parsedUrl = url.parse(receivedUrl);

            // check if we reached callback url
            if (parsedUrl.hostname !== "localhost") {
                // not a callback page
                return;
            }

            // parse the fragment params
            const params = {};
            const regex = /([^&=]+)=([^&]*)/g;
            let m;
            while ((m = regex.exec(parsedUrl.hash))) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                // Try to exchange the param values for an access token.
            }
            if (params["#access_token"]) {
                params.access_token = params["#access_token"];
                delete params["#access_token"];
            }

            // check if we received an access token
            if (params.access_token) {
                // send data to renderer view
                window.webContents.send("received-oauth-office-365-access-token", params.access_token);
            } else {
                window.webContents.send("received-oauth-failed");
            }
            consentWindow.destroy();
        };

        // check if the page changed and we received a valid url
        consentWindow.webContents.on("will-navigate", function(event, receivedUrl) {
            handleUrl(receivedUrl);
        });

        consentWindow.webContents.on("did-get-redirect-request", function(event, oldUrl, newUrl) {
            handleUrl(newUrl);
        });
    });
};
