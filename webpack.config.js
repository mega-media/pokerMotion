var path = require('path');
var webpack = require('webpack');
var config = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    path.resolve(__dirname, 'app/main.js')
  ],
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loaders: ['babel?presets[]=es2015'],
        include: path.join(__dirname, 'app')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules'],
        include: path.join(__dirname, 'app')
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', 'jsx', '.json']
  }
};
module.exports = config;
