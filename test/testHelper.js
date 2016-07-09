require('mock-local-storage');
var env = require('node-env-file');
const hook = require('css-modules-require-hook');

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]',
});

env(__dirname + '/../test.env', { raise: true });