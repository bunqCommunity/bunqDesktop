const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = ({BUILD_DIR, OUTPUT_DIR, PRODUCTION, DEVELOPMENT}) => {
    const plugins = [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION_MODE: JSON.stringify(PRODUCTION),
            DEVELOPMENT_MODE: JSON.stringify(DEVELOPMENT),
            "process.env.DEBUG": JSON.stringify(DEVELOPMENT),
            "process.env.NODE_ENV": JSON.stringify(
                process.env.NODE_ENV || "development"
            ),
            "process.env.WEBPACK_MODE": JSON.stringify(true)
        }),
        new webpack.ProvidePlugin({
            Promise: 'es6-promise-promise'
        }),
        new ExtractTextPlugin({
            filename: OUTPUT_DIR + "[name].css",
            disable: false,
            allChunks: true
        }),
    ];

    if (PRODUCTION) {
        // optimize js output using uglifyjs
        plugins.push(
            new UglifyJSPlugin({
                uglifyOptions: {
                    beautify: false,
                    sourceMap: true,
                    minimize: true,
                    ecma: 6,
                    compress: {
                        warnings: false,
                        drop_console: true
                    },
                    comments: false
                }
            })
        );
        // cleanup old build files from BUILD
        plugins.push(
            new CleanWebpackPlugin([`${BUILD_DIR}/${OUTPUT_DIR}/*.*`], {
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
