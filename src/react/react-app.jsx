import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client";
import App from "./App";

import ReactGA from 'react-ga'

require("../scss/main.scss");

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store);

ReactGA.initialize('UA-87358128-5');

ReactDOM.render(
    <App ReactGA={ReactGA} BunqJSClient={BunqJSClientInstance} />,
    document.getElementById("app")
);
