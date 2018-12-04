const fs = require("fs");
const axios = require("axios");
const glob = require("glob");
const path = require("path");

const url =
    "https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints";

const icons = [];

/**
 * Write the icons list to a file
 */
const writeIconsFile = () => {
    fs.writeFileSync(
        `${__dirname}/../src/react/StaticData/Functions/Con`,
        JSON.stringify({
            icons: icons
        })
    );

    console.log(
        `updated icons file with ${icons.length} total icons`
    );
};

/**
 * Get file paths from a specific dir and returns correct classes
 * @param directory
 * @param prefixClassname
 * @returns {Promise<any>}
 */
const getSvgFiles = async (directory, prefixClassname) => {
    return new Promise((resolve, reject) => {
        glob(
            `./node_modules/@fortawesome/fontawesome-free/svgs/${directory}/*`,
            {
                // options
            },
            (error, files) => {
                if (error) {
                    reject(error);
                    return;
                }

                // get the correct class names based on filename
                const parsedPaths = parseSvgFiles(files, prefixClassname);

                resolve(parsedPaths);
            }
        );
    });
};

/**
 * Receives local file paths and returns the correct classes to access the icon
 * @param filePaths
 * @param prefixClassname
 * @returns {*}
 */
const parseSvgFiles = (filePaths, prefixClassname) => {
    // go through all paths
    return filePaths.map(filePath => {
        // get base name minus extension
        const baseName = path.basename(filePath, ".svg");

        // return the correct classes used to access the icon
        return `${prefixClassname} fa-${baseName}`;
    });
};

/**
 * Get material icons online and write to file
 * @returns {Promise<void>}
 */
const getMaterialIcons = async () => {
    return axios
        .get(url)
        .then(response => response.data)
        .then(data => data.split("\n"))
        .then(namesAndCodes =>
            namesAndCodes.map(nameAndCode => {
                const parts = nameAndCode.split(" ");
                icons.push(parts[0]);
            })
        );
};

const start = async () => {
    // load material design icons remotely
    await getMaterialIcons();
    console.log(
        `updated Material icons list: ${icons.length} icons`
    );

    // get available font awesome icons from local files
    const regularIcons = await getSvgFiles("regular", "fa");
    regularIcons.map(regularIcon => icons.push(regularIcon));
    console.log(
        `updated regular Fontawesome icons list: ${regularIcons.length} icons`
    );

    const brandingIcons = await getSvgFiles("brands", "fab");
    brandingIcons.map(brandingIcon => icons.push(brandingIcon));
    console.log(
        `updated branding Fontawesome icons list: ${brandingIcons.length} icons`
    );

    const solidIcons = await getSvgFiles("solid", "fas");
    solidIcons.map(solidIcon => icons.push(solidIcon));
    console.log(
        `updated solid Fontawesome icons list: ${solidIcons.length} icons`
    );

    // write icons to file
    writeIconsFile();
};

// start the process
start()
    .then(result => {})
    .catch(console.error);
