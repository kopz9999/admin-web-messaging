// App
var getUserByToken = require('../utils/auth').getUserByToken;
var HttpStatus = require('http-status-codes');
// Locals
var OK = HttpStatus.OK;
var UNAUTHORIZED = HttpStatus.UNAUTHORIZED;

var ApplicationController = function() {
};

ApplicationController.prototype.setupResource = function(route) {
  route.get((req, res) => {
    var headers = req.headers;
    var authToken = headers['x-auth-token'];
    getUserByToken(authToken).then((user)=> {
      res.status(OK);
      res.json({
        user: user,
        layer: {
          appId: process.env.LAYER_APP_ID
        },
        algolia: {
          appId: process.env.ALGOLIA_APP_ID,
          appKey: process.env.ALGOLIA_APP_KEY,
        }
      });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED);
      res.end();
    });
  });
};

module.exports = ApplicationController;
