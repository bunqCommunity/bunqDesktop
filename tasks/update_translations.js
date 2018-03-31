const GoogleTranslate = require("@google-cloud/translate");
const fs = require("fs");
const path = require("path");
const awaiting = require("awaiting");
const packageInfo = require("../package.json");
const SUPPORTED_LANGUAGES = packageInfo.supported_languages;

let googleTranslate = new GoogleTranslate();

const LOCALES_DIR = path.join(__dirname, "../src/react/Locales");

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
 * Checks if we have required credentials
 * @returns {Promise<any>}
 */
const checkCredentials = async () => {
    return new Promise(resolve => {
        // check the following url on how to set this up
        // https://github.com/googleapis/nodejs-translate#before-you-begin
        googleTranslate.getCredentials((error, result) => {
            if (error) {
                // no valid credentials or something went wrong
                console.log(
                    "No Google authentication found, Automatic translations disabled"
                );
                console.error(error);
                googleTranslate = null;
            } else {
                console.log(
                    "Google SDK authenticated. Automatic translations enabled"
                );
            }
            resolve();
        });

        // nothing to do
        if (!googleTranslate) process.exit();
    });
};

/**
 * Run the script and do all required actions
 * @returns {Promise<void>}
 */
const start = async () => {
    await checkCredentials();

    // get the reference file in english
    const englishData = require(LOCALES_DIR + path.sep + "en.json");

    // go through all languages
    for (let key in SUPPORTED_LANGUAGES) {
        const languageKey = SUPPORTED_LANGUAGES[key];

        // ignore english
        if (languageKey === "en") continue;

        // get the current localeData
        const localeData = require(LOCALES_DIR +
            path.sep +
            languageKey +
            ".json");

        // will contain all translation keys which aren't done yet for this language
        const missingTranslationKeys = [];

        // go through all the missing keys for this language
        Object.keys(englishData).forEach(translationKey => {
            const translationValue = localeData[translationKey];

            // if not set or missing translation, add to the list
            if (
                !translationValue ||
                translationValue === "__MISSING_TRANSLATION__"
            ) {
                missingTranslationKeys.push(translationKey);
            }
        });

        console.log(`Translating ${missingTranslationKeys.length} values`);

        // wait for all data to be translated 3 at a time
        await awaiting.map(
            missingTranslationKeys,
            3,
            async missingTranslationKey => {
                // attempt to translate it with
                const result = await translateWord(
                    languageKey,
                    missingTranslationKey,
                    englishData[missingTranslationKey]
                );

                console.log(
                    `Translate to ${languageKey}: "${result.translated}"`
                );

                // set translated data in localeData for this language
                localeData[missingTranslationKey] = result.translated;

                // delay to prevent hitting the api limit
                await awaiting.delay(500);
            }
        );

        // sort alphabetically
        const tempLocaleData = {};
        Object.keys(localeData)
            .sort()
            .forEach(localeDataKey => {
                tempLocaleData[localeDataKey] = localeData[localeDataKey];
            });

        try {
            const targetPath = LOCALES_DIR + path.sep + languageKey + ".json";

            // write the updated file back to the locale files
            fs.writeFileSync(
                targetPath,
                JSON.stringify(tempLocaleData, null, "\t")
            );
        } catch (ex) {
            console.error(ex);
            break;
        }
    }
};

start()
    .then(() => {
        console.log("Finished translations");
    })
    .catch(console.error);
