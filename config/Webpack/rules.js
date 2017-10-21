const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        include: /(src)|(\.jsx?$)/,
        use: "babel-loader"
    },
    {
        test: /\.ts$/,
        include: /(src)|(\.ts$)/,
        use: "ts-loader"
    },
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader!css-loader",
            use: "css-loader"
        })
    },
    {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader!css-loader!sass-loader",
            use: "css-loader!sass-loader"
        })
    }
];
