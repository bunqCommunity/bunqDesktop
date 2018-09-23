const path = require("path");
const webpack = require("webpack");
const plugins = require("./config/Webpack/plugins");
const rules = require("./config/Webpack/rules");
const optimizations = require("./config/Webpack/optimizations");

const PRODUCTION = process.env.NODE_ENV === "production";
const DEVELOPMENT = !PRODUCTION;
const RELEASE_MODE = !!process.env.RELEASE_MODE;

const SRC_DIR = path.resolve(__dirname, "src/react");
const BUILD_DIR = path.resolve(__dirname, "app/react");
const OUTPUT_DIR = "./";

const moduleOptions = {
    BUILD_DIR,
    OUTPUT_DIR,
    PRODUCTION,
    DEVELOPMENT,
    RELEASE_MODE
};

let config = {
    entry: {
        bunqDesktop: `${SRC_DIR}/react-app.jsx`
    },
    target: "electron-renderer",
    output: {
        path: BUILD_DIR,
        filename: OUTPUT_DIR + "[name].js",
        pathinfo: PRODUCTION,
        publicPath: "react/",
        chunkFilename: OUTPUT_DIR + "[name].bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
        modules: ["node_modules", path.resolve(__dirname, "./src")]
    },
    mode: DEVELOPMENT ? "development" : "production",
    devtool: DEVELOPMENT ? "cheap-module-eval-source-map" : "source-map",
    cache: DEVELOPMENT,
    performance: PRODUCTION
        ? {
              hints: "warning"
          }
        : false,
    plugins: plugins(moduleOptions),
    optimization: optimizations(moduleOptions),
    module: {
        rules: rules(moduleOptions),
        unsafeCache: DEVELOPMENT
    },
    watchOptions: {
        aggregateTimeout: 300
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
