const packageInfo = require("../package.json");
const sentry = require("@sentry/electron");

const result = sentry.init({
    dsn: "https://5f0c4f6d64e143bbbfaf03e9307d5bb7@sentry.io/1233152",
    enableNative: true,
    enableJavaScript: true,
    release: packageInfo.version,
    enabled: process.env.NODE_ENV === "production",
    environment: process.env.NODE_ENV
});

export default result;
