var path = require('path');
var webpack = require('webpack');

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
    new webpack.NoErrorsPlugin()
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
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /(?:node_modules)|(?:vendor)/,
      include: __dirname
    }]
  }
};
