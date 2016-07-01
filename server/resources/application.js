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
          appId: 'layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8'
        },
        algolia: {
          appId: 'V0L0EPPR59',
          appKey: '363cd668faa7d392287982a6cb352d26',
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
