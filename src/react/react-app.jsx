import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import App from "./App";

require("../scss/main.scss");

// move to remote npm later
import BunqJSClient from "../../../BunqJSClient/index.ts";

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store);

ReactDOM.render(
    <App BunqJSClient={BunqJSClientInstance} />,
    document.getElementById("app")
);
