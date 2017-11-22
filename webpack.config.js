const path = require("path");

module.exports = {
    entry: "./app/app.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./public/js"),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["env", "react"]
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.svg$|\.woff$|\.woff2$|\.[ot]tf$|\.eot$|\.png$/,
                loader: "url-loader"
            }
        ]
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
};