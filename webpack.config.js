const path = require('path');
const url = require('url');
const webpack = require('webpack');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  cache: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader?cacheDirectory=true'],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'app')
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'output/development'),
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    host: '127.0.0.1',
    port: 8888,
    hot: true,
    inline: true,
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackNotifierPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'buffer'
    }),
    new CopyWebpackPlugin([{ from: 'entrance/src', to: 'src/' }]),
    new HtmlWebpackPlugin({
      title: 'pixijs-test',
      hash: true,
      cache: true,
      filename: 'index.html',
      template: 'entrance/index.html'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['pixi.min.js'],
      publicPath: 'src/',
      append: false
    })
  ],
  entry: {
    bundle: [
      'babel-polyfill',
      path.resolve(__dirname, 'app/index.js')
    ]
  }
};
