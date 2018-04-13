const fs = require("fs");
const path = require("path");
const packageInfo = require("../package.json");

const templates = [
    {
        templateName: "chocolateyInstall.ps1",
        targetLocation: "chocolatey/chocolateyInstall.ps1"
    },
    {
        templateName: "bunqdesktop.nuspec",
        targetLocation: "bunqdesktop.nuspec"
    }
];

console.log("\nUpdating versions across build files");

templates.forEach(template => {
    const templatePath = path.join(
        __dirname,
        `../build/templates/${template.templateName}`
    );
    const targetPath = path.join(__dirname, `../${template.targetLocation}`);

    // get file contents
    const fileContents = fs.readFileSync(templatePath);

    // buffer to string and replace the VERSION tag
    const stringContents = fileContents.toString();
    const updatedContents = stringContents.replace(
        /\$\{VERSION\}/g,
        packageInfo.version
    );

    // overwrite the file location with our updated version
    fs.writeFileSync(targetPath, updatedContents);

    console.log(`Updated: ${targetPath}`);
});

console.log(`Updated versions to ${packageInfo.version}`);
