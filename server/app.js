var express = require('express');
var bodyParser = require('body-parser');
var Resource = require('express-resource');
var ParticipantsController = require('./resources/participants');

var app = express();
var router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.resource('api/events', require('./resources/events'), { format: 'json' });
app.resource('api/logged_events', require('./resources/loggedEvents'), { format: 'json' });

var participantsController = new ParticipantsController(
  router.route('/conversations/:conversationId/participants')
);

app.use('/api', router);

module.exports = app;
