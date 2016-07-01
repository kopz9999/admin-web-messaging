'use strict';

var path = require('path');
var express = require('express');
var env = require('node-env-file');

var isDevelopment = (process.env.NODE_ENV !== 'production');
var app = express();
var port = isDevelopment ? 4000 : (process.env.PORT || 8080);
var compiler = null;
var webpack = null;
var webpackDevMiddleware = null;
var webpackHotMiddleware = null;
var config = null;
var watcher = null;
var chokidar = null;

env(__dirname + '/.env');
app.use(express.static('.'));
app.use(function(req, res, next) {
  require('./server/app')(req, res, next);
});

if (isDevelopment) {
  chokidar = require('chokidar');
  webpack = require('webpack');
  webpackDevMiddleware = require('webpack-dev-middleware');
  webpackHotMiddleware = require('webpack-hot-middleware');
  config = require('./webpack.config');

  compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    watchOptions: {
      poll: true
    }
  }));
  app.use(webpackHotMiddleware(compiler));
  watcher = chokidar.watch('./server', {
    persistent: true,
    usePolling: true,
  });

  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log("Clearing /server/ module cache from server");
      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });
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
