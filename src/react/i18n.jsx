import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { reactI18nextModule } from "react-i18next";

let googleTranslate = null;
const remote = require("electron").remote;
const path = remote.require("path");
const fs = remote.require("fs");

export const SUPPORTED_LANGUAGES = ["en", "nl", "de"];

if (process.env.NODE_ENV === "development") {
    // don't add thsi module in dev mode
    const GoogleTranslate = require("@google-cloud/translate");
    googleTranslate = new GoogleTranslate();
}

/**
 * Uses the google api to create a translation
 * @param languageKey
 * @param textKey
 * @param textValue
 * @returns {Promise<{languageKey: *, textKey: *, translated: string}>}
 */
const translateWord = async (languageKey, textKey, textValue) => {
    let translatedText = "__MISSING_TRANSLATION__";
    if (!googleTranslate)
        return {
            languageKey: languageKey,
            textKey: textKey,
            translated: translatedText
        };

    try {
        const translatedResult = await googleTranslate.translate(
            textValue,
            languageKey
        );
        translatedText = translatedResult[0];
    } catch (ex) {}

    return {
        languageKey: languageKey,
        textKey: textKey,
        translated: translatedText
    };
};

/**
 * Adds a new key to the locale data
 * @param data
 * @returns {Promise<void>}
 */
const addLocaleKey = async data => {
    // go through all languages
    for (let key in SUPPORTED_LANGUAGES) {
        const languageKey = SUPPORTED_LANGUAGES[key];

        // get the current localeData
        const localeData = require("./Locales/" + languageKey + ".json");

        // list of promisses
        const dataToTranslate = [];

        // go through all the missing keys for this language
        Object.keys(data).forEach(missingKey => {
            const missingText = data[missingKey];

            console.log("Check if exists");

            // don't add existing keys
            if (!localeData[missingKey]) {
                console.log("NO: Check if exists");
                if (languageKey !== "en") {
                    console.log("Not english");
                    // translate this data if it isn't english
                    dataToTranslate.push(
                        translateWord(languageKey, missingKey, missingText)
                    );
                }

                localeData[missingKey] =
                    languageKey === "en" ? missingText : "";
            }
        });

        // wait for all requests to finish
        const translatedData = await Promise.all(dataToTranslate);

        console.log(translatedData);

        // go through all results and set the new translated value
        translatedData.forEach(translatedDataItem => {
            localeData[translatedDataItem.textKey] =
                translatedDataItem.translated;
        });

        // sort alphabetically
        const tempLocaleData = {};
        Object.keys(localeData)
            .sort()
            .forEach(localeDataKey => {
                tempLocaleData[localeDataKey] = localeData[localeDataKey];
            });

        try {
            const targetPath = path.join(
                __dirname,
                "../src/react/Locales/" + languageKey + ".json"
            );
            console.log("Updating files", targetPath, tempLocaleData)

            // write the updated file back to the locale files
            fs.writeFileSync(
                targetPath,
                JSON.stringify(tempLocaleData, null, "\t")
            );
        } catch (ex) {}
    }
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
                .then(console.log)
                .catch(console.error);
        }
    }
};

i18n
    .use(Backend)
    .use(reactI18nextModule)
    .init({
        // don't fallback to english in dev mode to make missing keys easier to spot
        fallbackLng: process.env.NODE_ENV === "development" ? null : "en",

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
