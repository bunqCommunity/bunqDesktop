const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const babelLoaderConfig = {
    loader: "babel-loader?cacheDirectory=./node_modules/.cache/babel_loader"
};

module.exports = ({ BUILD_DIR, OUTPUT_DIR, PRODUCTION, DEVELOPMENT }) => {
    return [
        {
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            include: /(src)|(\.jsx?$)/,
            use: babelLoaderConfig
        },
        {
            test: /\.tsx?$/,
            include: /(src)|(\.ts$)/,
            use: [
                babelLoaderConfig,
                {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true
                    }
                }
            ]
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        url: false
                    }
                },
                "sass-loader"
            ]
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        publicPath: "./"
                    }
                }
            ]
        }
    ];
};
