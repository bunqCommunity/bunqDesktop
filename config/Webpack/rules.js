const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
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
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" }
    }
];
