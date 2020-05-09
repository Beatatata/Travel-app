const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin= require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
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
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify('production/development')
    })
]
}
