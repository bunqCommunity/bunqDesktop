const fs = require("fs");
const axios = require("axios");

const url =
    "https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints";

const icons = [];

axios
    .get(url)
    .then(response => response.data)
    .then(data => data.split("\n"))
    .then(namesAndCodes =>
        namesAndCodes.map(nameAndCode => {
            const parts = nameAndCode.split(" ");
            icons.push(parts[0]);
        })
    )
    .then(_ => {
        fs.writeFileSync(
            `${__dirname}/../src/react/Helpers/Icons.json`,
            JSON.stringify({
                icons: icons,
                updated: new Date()
            })
        );

        console.log(`Successfully updated Material icons list: ${icons.length} icons`)
    });
