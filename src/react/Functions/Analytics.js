import store from "store";
import settings from "../ImportWrappers/electronSettings";
import { generateGUID } from "./Utils";
import Logger from "./Logger";
import { ANALYTICS_ENABLED } from "../Reducers/options";

export default (forceEnable = false) => {
    if (process.env.NODE_ENV === "development") {
        Logger.debug("Disabled GA: dev mode");
        return false;
    }

    // get setting value for enabled status
    const enabled = settings.get(ANALYTICS_ENABLED);
    if (enabled !== true && forceEnable === false) {
        Logger.debug("Disabled GA: setting = " + enabled);
        return;
    }

    // prevent duplicate ga loads
    if (!window.ga) {
        (function(i, s, o, g, r, a, m) {
            i["GoogleAnalyticsObject"] = r;
            (i[r] =
                i[r] ||
                function() {
                    (i[r].q = i[r].q || []).push(arguments);
                }),
                (i[r].l = 1 * new Date());
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

        // give global access
        window.ga = ga;
    }

    let userGUID = store.get("user-guid");
    if (!userGUID) {
        userGUID = generateGUID();
        store.set("user-guid", userGUID);
    }

    // setup our analytics id and other settings
    window.ga("create", "UA-87358128-5", {
        clientId: userGUID
    });
    window.ga("set", "checkProtocolTask", null);
    window.ga("set", "checkStorageTask", null);
    window.ga("set", "historyImportTask", null);
    window.ga("set", "anonymizeIp", true);
    window.ga("send", "event", "Version", process.env.CURRENT_VERSION);

    return true;
};
