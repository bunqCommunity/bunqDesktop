const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

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
        new ExtractTextPlugin({
            filename: OUTPUT_DIR + "[name].css",
            disable: false,
            allChunks: true
        }),
        // split common files
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            minChunks: 2
        }),
        // webpack analyzer
        // new BundleAnalyzerPlugin({
        //     // don't open the file automatically
        //     openAnalyzer: false,
        //     // default type to open (`stat`, `parsed` or `gzip`)
        //     defaultSizes: "parse",
        //     // create a server for the watcher or a static file for production enviroments
        //     analyzerMode: "static",
        //     // output outside of the public folder
        //     reportFilename: "../../webpack.report.html",
        //     /**
        //      * stats file for analyzer - use with:
        //      * @see https://alexkuz.github.io/stellar-webpack/
        //      * @see https://alexkuz.github.io/webpack-chart/
        //      */
        //     generateStatsFile: true,
        //     statsFilename: "../../webpack.stats.json"
        // })
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
