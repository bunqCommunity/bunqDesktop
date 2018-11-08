import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client";

// bunqDesktop entry point
import App from "./App";

// Css styling and libraries
import "../scss/main.scss";
import "animate.css";
import "typeface-roboto";

import Logger from "./Helpers/Logger";
import Analytics from "./Helpers/Analytics";

Analytics();

if (store.get("BUNQDESKTOP_STORED_PAYMENTS")) store.remove("BUNQDESKTOP_STORED_PAYMENTS");
if (store.get("BUNQDESKTOP_STORED_BUNQ_ME_TABS")) store.remove("BUNQDESKTOP_STORED_BUNQ_ME_TABS");
if (store.get("BUNQDESKTOP_STORED_MASTER_CARD_ACTIONS")) store.remove("BUNQDESKTOP_STORED_MASTER_CARD_ACTIONS");
if (store.get("BUNQDESKTOP_STORED_REQUEST_INQUIRIES")) store.remove("BUNQDESKTOP_STORED_REQUEST_INQUIRIES");
if (store.get("BUNQDESKTOP_STORED_REQUEST_RESPONSES")) store.remove("BUNQDESKTOP_STORED_REQUEST_RESPONSES");
if (store.get("BUNQDESKTOP_STORED_REQUEST_INQUIRY_BATCHES")) store.remove("BUNQDESKTOP_STORED_REQUEST_INQUIRY_BATCHES");

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store, Logger);
BunqJSClientInstance.setKeepAlive(false);

ReactDOM.render(<App BunqJSClient={BunqJSClientInstance} />, document.getElementById("app"));
