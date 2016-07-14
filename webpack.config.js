var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var values = require('postcss-modules-values');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

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
    new ExtractTextPlugin('app.css'),
    devFlagPlugin
  ],
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        exclude: /(?:node_modules)|(?:vendor)/, 
        include: __dirname,
        loader: 'babel',
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' }
    ]
  },
  postcss: [
    values
  ]
};
