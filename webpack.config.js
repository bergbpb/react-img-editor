const path = require("path");
const webpack = require("webpack");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// currently on node 16
module.exports = {
    entry: "./src/index.tsx",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
              },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader?limit=8192',
                        options: {},
                    },
                ],
            },
        ]
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        },
        extensions: [".*", '.tsx', '.ts', '.js' , ".jsx", '.json']
    },
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    devServer: {
        static : {
            directory : path.join(__dirname, "public/")
        },
        port: 3000,
        devMiddleware:{
            publicPath: "https://localhost:3000/dist/",
         },
        historyApiFallback: true,
        hot: "only",
    },
    plugins: [
        new ProgressBarPlugin()
    ]
};