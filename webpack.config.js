const path = require("path");
const webpack = require("webpack");
const plugins = require("./config/Webpack/plugins");
const rules = require("./config/Webpack/rules");
const optimizations = require("./config/Webpack/optimizations");

const PRODUCTION = process.env.NODE_ENV === "production";
const DEVELOPMENT = !PRODUCTION;

const SRC_DIR = path.resolve(__dirname, "src/react");
const BUILD_DIR = path.resolve(__dirname, "app/react");
const OUTPUT_DIR = "./";

let config = {
    entry: {
        BunqDesktop: `${SRC_DIR}/react-app.jsx`,
        vendor_all: [
            "react",
            "react-dom",
            "node-forge",
            "material-ui",
            "moment"
        ]
    },
    target: "electron-renderer",
    output: {
        path: BUILD_DIR,
        filename: OUTPUT_DIR + "[name].js",
        publicPath: "react/",
        chunkFilename: OUTPUT_DIR + "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
        modules: ["node_modules", path.resolve(__dirname, "./src")]
    },
    mode: DEVELOPMENT ? "development" : "production",
    devtool: DEVELOPMENT ? "eval" : false,
    cache: DEVELOPMENT,
    performance: PRODUCTION,
    plugins: plugins({ BUILD_DIR, OUTPUT_DIR, PRODUCTION, DEVELOPMENT }),
    optimization: optimizations({
        BUILD_DIR,
        OUTPUT_DIR,
        PRODUCTION,
        DEVELOPMENT
    }),
    module: {
        rules: rules,
        unsafeCache: DEVELOPMENT
    },
    node: {
        console: false,
        __dirname: false,
        fs: "empty",
        net: "empty",
        tls: "empty"
    }
};

module.exports = config;
