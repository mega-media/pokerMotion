const path = require('path');
const webpack = require('webpack');

const config = {
    entry: [
        path.resolve(__dirname, 'app/main.js')
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'app')
            }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            }
        })
    ],
    output: {
        libraryTarget: 'umd',
        library: 'Poker',
        path: path.resolve(__dirname, 'release'),
        filename: 'poker.min.js'
    },
    externals: {
        Phaser: 'Phaser'
    }
};
module.exports = config;
