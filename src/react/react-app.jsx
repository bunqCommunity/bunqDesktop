import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client";

import App from "./App";
import "../scss/main.scss";
import "animate.css";

import Logger from "./Helpers/Logger";
import Analytics from "./Helpers/Analytics";

Analytics();

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store, Logger);

ReactDOM.render(
    <App BunqJSClient={BunqJSClientInstance} />,
    document.getElementById("app")
);
