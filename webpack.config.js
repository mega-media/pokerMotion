const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'build/phaser.min.js');

const config = {
    entry: {
        "bundle": [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/dev-server',
            path.resolve(__dirname, 'app/demo.js')
        ],
        "vendor":[
            'phaser'
        ]
    },
    module: {
        loaders: [
            {
                test: /phaser/,
                loader: 'script'
            },
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'app')
            }
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser
        },
        extensions: ['', '.js']
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new WebpackNotifierPlugin()
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        publicPath: '/'
    }
};
module.exports = config;
