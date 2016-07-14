var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var values = require('postcss-modules-values');

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
    new ExtractTextPlugin('app.css'),
    devFlagPlugin
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /(?:node_modules)|(?:vendor)/, include: __dirname },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' }
    ]
  },
  postcss: [
    values
  ]
};
