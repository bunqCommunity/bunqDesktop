const path = require("path");
const webpack = require("webpack");
const plugins = require("./config/Webpack/plugins");
const rules = require("./config/Webpack/rules");

const PRODUCTION = process.env.NODE_ENV === "production";
const DEVELOPMENT = !PRODUCTION;

const SRC_DIR = path.resolve(__dirname, "src/react");
const BUILD_DIR = path.resolve(__dirname, "app/react");
const OUTPUT_DIR = "./";

const moduleOptions = { BUILD_DIR, OUTPUT_DIR, PRODUCTION, DEVELOPMENT };

let config = {
    entry: {
        BunqDesktop: `${SRC_DIR}/react-app.jsx`
    },
    target: "electron-renderer",
    output: {
        path: BUILD_DIR,
        filename: OUTPUT_DIR + "[name].js",
        publicPath: "react/",
        chunkFilename: OUTPUT_DIR + "[name].bundle.js"
    },
    resolve: {
        extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
        modules: ["node_modules", path.resolve(__dirname, "./src")]
    },
    devtool: DEVELOPMENT ? "eval" : "source-map",
    cache: DEVELOPMENT,
    performance: PRODUCTION
        ? {
              hints: "warning"
          }
        : false,
    plugins: plugins(moduleOptions),
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
