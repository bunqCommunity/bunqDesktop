const packageInfo = require("../../package.json");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = ({ BUILD_DIR, OUTPUT_DIR, PRODUCTION, DEVELOPMENT }) => {
    const optimizations = {
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        sideEffects: PRODUCTION,
        removeAvailableModules: PRODUCTION,
        flagIncludedChunks: PRODUCTION,
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 3, // The default limit is too small to showcase the effect
                    minSize: 10000 // This is example is too small to create commons chunks
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    };

    if (PRODUCTION) {
        optimizations.minimize = true;
        optimizations.minimizer = [
            new UglifyJSPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        inline: false
                    }
                }
            })
        ];
    } else {
    }

    return optimizations;
};
