require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const awaiting = require("awaiting");
const CSVParse = require("csv-parse/lib/sync");
const packageInfo = require("../package.json");
const SUPPORTED_LANGUAGES = packageInfo.supported_languages;

const LOCALES_DIR = path.join(__dirname, "../src/react/Locales");
const LOCALES_CRODWIN_FILE = `${LOCALES_DIR}/Crowdin/import.csv`;

/**
 * Gets the main export.csv file from crowdin and parses it
 * @returns {Promise<*>}
 */
const getCrowdinAPIData = async (update = true) => {
    if (update) {
        if (process.env.CROWDIN_API_KEY) {
            const parameters = `key=${process.env.CROWDIN_API_KEY}&language=nl&file=export.csv`;
            const response = await axios({
                url: `https://api.crowdin.com/api/project/bunqdesktop/export-file?${parameters}`,
                method: "GET",
                responseType: "stream"
            });

            response.data.pipe(fs.createWriteStream(LOCALES_CRODWIN_FILE));

            // wait for teh response data stream to end
            await new Promise((resolve, reject) => {
                response.data.on("end", () => resolve());
                response.data.on("error", error => reject(error));
            });
        } else {
            console.log("CROWDIN_API_KEY environment variable empty or not set!");
        }
    }

    try {
        // get the new file contents
        const crowdinImportContent = await awaiting.callback(fs.readFile, LOCALES_CRODWIN_FILE);

        // parse csv into js arrays
        const data = CSVParse(crowdinImportContent);

        // map key/value combos
        const keyedData = data.reduce((accumulator, translations) => {
            accumulator[translations[0]] = {
                de: translations[1],
                nl: translations[2],
                it: translations[3],
                es: translations[4],
                gr: translations[5]
            };
            return accumulator;
        }, {});

        console.log("Downloaded and parsed Crowdin file successfully");

        return keyedData;
    } catch (ex) {
        console.log("Crowdin file not found");
    }
    return {};
};

/**
 * Run the script and do all required actions
 * @returns {Promise<void>}
 */
const start = async () => {
    const crowdinData = await getCrowdinAPIData(true);

    // get the reference file in english
    const englishData = require(LOCALES_DIR + path.sep + "en.json");

    // go through all languages
    for (let key in SUPPORTED_LANGUAGES) {
        const languageKey = SUPPORTED_LANGUAGES[key];

        // ignore english
        if (languageKey === "en") continue;

        // get the current localeData
        const localeData = require(LOCALES_DIR + path.sep + languageKey + ".json");

        // will contain all translation keys which aren't done yet for this language
        const missingTranslationKeys = [];

        // go through all the missing keys for this language
        Object.keys(englishData).forEach(translationKey => {
            let translationValue;

            if (crowdinData[translationKey] && crowdinData[translationKey][languageKey]) {
                // prefer crowdin version if one exists
                translationValue = crowdinData[translationKey][languageKey];
            } else {
                // fallback to local translation
                translationValue = localeData[translationKey];
            }

            // if not set or missing translation, add to the list
            if (!translationValue || translationValue === "__MISSING_TRANSLATION__") {
                missingTranslationKeys.push(translationKey);
            } else {
                localeData[translationKey] = translationValue;
            }
        });

        console.log(`Missing ${missingTranslationKeys.length} translations for ${languageKey}`);

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
            fs.writeFileSync(targetPath, JSON.stringify(tempLocaleData, null, "\t"));
        } catch (ex) {
            console.error(ex);
            break;
        }
    }

    // update the export.csv file for crowdin

    const escapeCsv = val => `"${val.replace('"', '"""')}"`;

    const csvExportObject = {};
    Object.keys(englishData).forEach(translationKey => {
        csvExportObject[translationKey] = [];
    });

    // go through all registered languages
    SUPPORTED_LANGUAGES.forEach(languageKey => {
        if (languageKey == "en") return;

        const targetPath = LOCALES_DIR + path.sep + languageKey + ".json";
        const languageData = JSON.parse(fs.readFileSync(targetPath).toString());

        Object.keys(englishData).forEach(translationKey => {
            if (languageData[translationKey]) {
                csvExportObject[translationKey].push(languageData[translationKey]);
            } else {
                // default missing translations to empty string
                csvExportObject[translationKey].push("");
            }
        });
    });

    const generateCsv = () => {
        let output = ``;
        Object.keys(csvExportObject).forEach(key => {
            const csvExportArray = csvExportObject[key];
            const escapedArray = csvExportArray.map(item => escapeCsv(item));
            output += `${escapeCsv(key)},${escapedArray.join(",")}\n`;
        });
        return output;
    };

    fs.writeFileSync(`${__dirname}/../src/react/Locales/Crowdin/export.csv`, generateCsv());
};

start()
    .then(() => {
        console.log("Finished translations");
    })
    .catch(console.error);
