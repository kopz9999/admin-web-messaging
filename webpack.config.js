var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  watchOptions: {
    poll: true
  },
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js',
    hot: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('app.css')
  ],
  externals: {
    'layer-sdk': 'layer'
  },
  resolve: {
    alias: {
      'layer-react': path.join(__dirname, 'layer-react')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /(?:node_modules)|(?:vendor)/, include: __dirname },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader?module!cssnext-loader') },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' }
    ]
  }
};
