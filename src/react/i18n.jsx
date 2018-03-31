import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { reactI18nextModule } from "react-i18next";

const remote = require("electron").remote;
const path = remote.require("path");
const fs = remote.require("fs");

export const SUPPORTED_LANGUAGES = ["en", "nl"];

// custom xhr function
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
            // go through all languages
            for (let key in SUPPORTED_LANGUAGES) {
                const languageKey = SUPPORTED_LANGUAGES[key];

                // get the current localeData
                const localeData = require("./Locales/" +
                    languageKey +
                    ".json");

                // go through all the missing keys for this language
                Object.keys(data).forEach(missingKey => {
                    const missingText = data[missingKey];
                    localeData[missingKey] =
                        languageKey === "en"
                            ? missingText
                            : "__MISSING_TRANSLATION__";
                });

                try {
                    // write the updated file back to the locale files
                    fs.writeFileSync(
                        path.join(
                            __dirname,
                            "../src/react/Locales/" + languageKey + ".json"
                        ),
                        JSON.stringify(localeData, null, "\t")
                    );
                } catch (ex) {}
            }
        }
    }
};

i18n
    .use(Backend)
    .use(reactI18nextModule)
    .init({
        fallbackLng: "en",
        saveMissing: true,

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
