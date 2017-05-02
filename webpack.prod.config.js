const path = require('path');
const webpack = require('webpack');

const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'build/phaser.min.js');

const config = {
    entry: {
        "poker.min": [
            path.resolve(__dirname, 'app/main.js')
        ],
        "vendor.min":[
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
        filename: '[name].js',
    }
};
module.exports = config;
