import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client";
import App from "./App";
import { generateGUID } from "./Helpers/Utils";

import analytics from "universal-analytics";

require("../scss/main.scss");

let userGUID = store.get("user-guid");

if (!userGUID) {
    userGUID = generateGUID();
    store.set("user-guid", userGUID);
}

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store);
const analyticsInstance = analytics("UA-87358128-5", userGUID, {
    strictCidFormat: false
});

// send the Version event to track the user's version
analyticsInstance.event("Version", process.env.CURRENT_VERSION).send();

ReactDOM.render(
    <App analytics={analyticsInstance} BunqJSClient={BunqJSClientInstance} />,
    document.getElementById("app")
);
