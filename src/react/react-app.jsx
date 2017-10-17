import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client";
import App from "./App";

require("../scss/main.scss");

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store);

ReactDOM.render(
    <App BunqJSClient={BunqJSClientInstance} />,
    document.getElementById("app")
);
