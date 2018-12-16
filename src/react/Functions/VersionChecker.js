import axios from "axios";

/*!
 * isSemVer - v0.1 - 9/05/2010
 * http://benalman.com/
 * http://semver.org/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
const isSemVer = (function() {
    var a = /^(<|>|[=!<>]=)?\s*(\d+(?:\.\d+){0,2})([a-z][a-z0-9\-]*)?$/i;
    function b(e, c) {
        var d = (e + "").match(a);
        return d
            ? (c ? d[1] || "==" : "") +
                  '"' +
                  (d[2] + ".0.0").match(/\d+(?:\.\d+){0,2}/)[0].replace(/(?:^|\.)(\d+)/g, function(g, f) {
                      return Array(9 - f.length).join(0) + f;
                  }) +
                  (d[3] || "~") +
                  '"'
            : c
                ? "==0"
                : 1;
    }
    return function(e) {
        e = b(e);
        for (var c, d = 1; (c = arguments[d++]); ) {
            if (!new Function("return " + e + b(c, 1))()) {
                return false;
            }
        }
        return true;
    };
})();

export default async () => {
    const currentVersion = process.env.CURRENT_VERSION;
    try {
        const response = await axios
            .get("https://api.github.com/repos/bunqCommunity/bunqDesktop/releases/latest")
            .then(response => response.data);
        const latestVersion = response.tag_name;
        return {
            currentVersion: currentVersion,
            latestVersion: latestVersion,
            newerLink: isSemVer(currentVersion, `<${latestVersion}`) ? response.html_url : false
        };
    } catch (ex) {
        // fallback to no-update
        return {
            currentVersion,
            latestVersion: process.env.CURRENT_VERSION,
            newerLink: false
        };
    }
};

export const allReleases = () =>
    axios.get("https://api.github.com/repos/bunqCommunity/bunqDesktop/releases").then(response => response.data);
