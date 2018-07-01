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
            test: /\.worker\.js$/,
            use: [
                "babel-loader",
                {
                    loader: "worker-loader",
                    options: { inline: true, fallback: false }
                }
            ]
        }
    ];
};
