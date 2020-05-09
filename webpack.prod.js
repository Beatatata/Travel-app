const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/client/index.js',
    output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader']
            },
            {
                 test: '/\.js$/',
                 exclude: /node_modules/,
                 loader: "babel-loader",
            }
        ]
  },
  plugins: [
    new HtmlWebPackPlugin({
        template: "./src/client/views/index.html",
        filename: "./index.html",
    }),
    new WorkboxPlugin.GenerateSW(),
    new MiniCssExtractPlugin({filename: '[name].scss'})
]
}
