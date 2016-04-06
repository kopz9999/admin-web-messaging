var path = require('path');
var webpack = require('webpack');
var devFlagPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"production"',
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    devFlagPlugin
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
