const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

const config = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        path.resolve(__dirname, 'app/demo.js')
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
        new WebpackNotifierPlugin()
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    externals: {
        Phaser: 'Phaser'
    }
};
module.exports = config;
