'use strict';

var path = require('path');
var express = require('express');
var isDevelopment = (process.env.NODE_ENV !== 'production');
var app = express();
var port = isDevelopment ? 4000 : (process.env.PORT || 8080);
var compiler = null;
var webpack = null;
var webpackDevMiddleware = null;
var webpackHotMiddleware = null;
var config = null;

app.use(express.static('.'));
if (isDevelopment) {
  webpack = require('webpack');
  webpackDevMiddleware = require('webpack-dev-middleware');
  webpackHotMiddleware = require('webpack-hot-middleware');
  config = require('./webpack.config');

  compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use('/static', express.static('dist'));
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info('Webpack devServer started. Open http://localhost:' + port + ' in your browser.');
  }
});
