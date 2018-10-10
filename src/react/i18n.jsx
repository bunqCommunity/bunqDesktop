import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { reactI18nextModule } from "react-i18next";

import fs from "./ImportWrappers/fs";
import path from "./ImportWrappers/path";

/**
 * Adds a new key to the reference locale data
 * @param data
 * @returns {Promise<void>}
 */
const addLocaleKey = async data => {
    // get the current localeData
    const localeData = require("./Locales/en.json");

    // go through all the missing keys for this language
    Object.keys(data).forEach(missingKey => {
        const missingText = data[missingKey];

        // don't add existing keys
        if (!localeData[missingKey]) {
            localeData[missingKey] = missingText;
        }
    });

    // sort alphabetically
    const tempLocaleData = {};
    Object.keys(localeData)
        .sort()
        .forEach(localeDataKey => {
            tempLocaleData[localeDataKey] = localeData[localeDataKey];
        });

    try {
        const targetPath = path.join(__dirname, "../src/react/Locales/en.json");

        // write the updated file back to the locale files
        fs.writeFileSync(targetPath, JSON.stringify(tempLocaleData, null, "\t"));
    } catch (ex) {}
};

/**
 * Custom request handler for xhr-backend
 * @param url
 * @param options
 * @param callback
 * @param data
 */
const loadLocales = (url, options, callback, data) => {
    const [action, language] = url.split("|");

    if (action === "LOAD") {
        try {
            const locale = require("./Locales/" + language + ".json");
            callback(locale, { status: "200" });
        } catch (e) {
            console.error(e);
            callback(null, { status: "404" });
        }
    } else {
        // only add data in dev mode
        if (process.env.NODE_ENV === "development") {
            addLocaleKey(data)
                .then(() => {})
                .catch(console.error);
        }
    }
};

i18n.use(Backend)
    .use(reactI18nextModule)
    .init({
        // fallback to english
        fallbackLng: "en",

        // trigger save missing event only in dev mode
        saveMissing: process.env.NODE_ENV === "development",

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations",

        // debug mode
        debug: process.env.NODE_ENV === "development",

        backend: {
            loadPath: "LOAD|{{lng}}",
            addPath: "ADD|{{ns}}",
            parse: data => data,
            ajax: loadLocales
        },

        interpolation: {
            escapeValue: false // not needed for react!!
        },
        react: {
            wait: true
        }
    });

export default i18n;
