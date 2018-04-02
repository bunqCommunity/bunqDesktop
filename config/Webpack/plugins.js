const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const packageInfo = require("../../package.json");

module.exports = ({ BUILD_DIR, OUTPUT_DIR, PRODUCTION, DEVELOPMENT }) => {
    const plugins = [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env.CURRENT_VERSION": JSON.stringify(packageInfo.version),
            "process.env.DEVELOPMENT": JSON.stringify(DEVELOPMENT),
            "process.env.PRODUCTION": JSON.stringify(PRODUCTION),
            "process.env.WEBPACK_MODE": JSON.stringify(true)
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ];

    if (PRODUCTION) {
        // optimize js output using uglifyjs
        plugins.push(
            new UglifyJSPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: { warnings: false },
                    ecma: 8,
                    ie8: false,
                    minimize: true,
                    output: {
                        comments: false,
                        beautify: false
                    },
                    warnings: false
                }
            })
        );
        // cleanup old build files from BUILD
        plugins.push(
            new CleanWebpackPlugin([`${BUILD_DIR}/${OUTPUT_DIR}/*.*`], {
                root: `${__dirname}/../..`,
                exclude: [],
                verbose: false,
                dry: false
            })
        );
    } else {
        // development only plugins
    }

    return plugins;
};
