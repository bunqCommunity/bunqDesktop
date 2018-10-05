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
                    minChunks: 3,
                    minSize: 25000
                },
                vendor: {
                    test: /[\\/]node_modules[\\/].*(js|jsx?)$/,
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
                },
                cache: true,
                parallel: true
            })
        ];
    } else {
    }

    return optimizations;
};
