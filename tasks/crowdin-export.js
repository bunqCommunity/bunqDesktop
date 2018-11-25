// export json files to csv
const fs = require("fs");

const enJson = require("../src/react/Locales/en.json");
const deJson = require("../src/react/Locales/de.json");
const nlJson = require("../src/react/Locales/nl.json");

const escape = val => val.replace(",", '","');
const generateCsv = json => {
    let output = "";
    Object.keys(json).forEach(key => {
        const value = json[key];
        output += `${escape(key)},${escape(value)}\n`;
    });
    return output;
};

let enContents = generateCsv(enJson);
let deContents = generateCsv(deJson);
let nlContents = generateCsv(nlJson);

fs.writeFileSync(__dirname + "/../en.test.csv", enContents);
fs.writeFileSync(__dirname + "/../de.test.csv", deContents);
fs.writeFileSync(__dirname + "/../nl.test.csv", nlContents);
