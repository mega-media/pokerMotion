const path = require('path');
const webpack = require('webpack');
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
    pixi = path.join(phaserModule, 'build/custom/pixi.js'),
    p2 = path.join(phaserModule, 'build/custom/p2.js');

const config = {
    entry: [
        path.resolve(__dirname, 'app/main.js')
    ],
    module: {
        loaders: [
            {
                test: /phaser|pixi.js|p2/,
                loader: 'script'
            },
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'app')
            },
            {
                test: /\.svg$/,
                loaders: ['url-loader?limit=10000&name=[name].[ext]'],
                include: path.join(__dirname, 'app')
            }
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi.js': pixi,
            'p2': p2,
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
        filename: 'poker.min.js'
    }
};
module.exports = config;
