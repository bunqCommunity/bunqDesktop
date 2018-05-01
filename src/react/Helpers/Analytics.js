import store from "store";
import { generateGUID } from "./Utils";

export default () => {
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
    })(
        window,
        document,
        "script",
        "https://www.google-analytics.com/analytics.js",
        "ga"
    );

    // give global access
    window.ga = ga;

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
};
