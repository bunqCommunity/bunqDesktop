import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client";

import App from "./App";
import "../scss/main.scss";

import Logger from "./Helpers/Logger";
import Analytics from "./Helpers/Analytics";

// check if analytics are dsisabled
const analyticsDisabled = store.get("DISABLE_ANALYTICS");

// only add analytics if in production more and analytics isn't disabled
if (process.env.NODE_ENV !== "development" && !analyticsDisabled) {
    Analytics();
}

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store, Logger);

ReactDOM.render(
    <App BunqJSClient={BunqJSClientInstance} />,
    document.getElementById("app")
);
