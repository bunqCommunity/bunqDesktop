import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client";

import App from "./App";
import "../scss/main.scss";
import { generateGUID } from "./Helpers/Utils";

let userGUID = store.get("user-guid");
if (!userGUID) {
    userGUID = generateGUID();
    store.set("user-guid", userGUID);
}

window.ga("create", "UA-87358128-5", {
    clientId: userGUID
});
window.ga("set", "checkProtocolTask", null);
window.ga("set", "checkStorageTask", null);
window.ga("set", "historyImportTask", null);
window.ga('set', 'anonymizeIp', true);

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store);

ReactDOM.render(
    <App BunqJSClient={BunqJSClientInstance} />,
    document.getElementById("app")
);
