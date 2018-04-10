const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = ({ BUILD_DIR, OUTPUT_DIR, PRODUCTION, DEVELOPMENT }) => {
    return [
        {
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            include: /(src)|(\.jsx?$)/,
            use: "babel-loader"
        },
        {
            test: /\.tsx?$/,
            include: /(src)|(\.ts$)/,
            use: ["babel-loader", "ts-loader"]
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
            test: /\.worker\.jsx?$/,
            use: [
                "babel-loader",
                {
                    loader: "worker-loader",
                    options: { inline: false, fallback: false }
                }
            ]
        },
        {
            test: /\.worker\.tsx?$/,
            use: [
                "babel-loader",
                "ts-loader",
                {
                    loader: "worker-loader",
                    options: { inline: false, fallback: false }
                }
            ]
        }
    ];
};
