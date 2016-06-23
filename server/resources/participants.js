// App
var USER_INFO_ENDPOINT = require('../../shared/Endpoints').USER_INFO_ENDPOINT;
var LayerAPI = require('layer-api');
var API_TOKEN = 'PQ4e10cZFRhpU2RQl7HKEbheV39unhkYWQNbVVPb8DTEZhOr';
var APP_ID = 'layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8';
var getUserByToken = require('../utils/auth').getUserByToken;
var HttpStatus = require('http-status-codes');
var CREATED = HttpStatus.CREATED;
var OK = HttpStatus.OK;
var userFactoryInstance = require('../models/User').userFactoryInstance;

var ParticipantsController = function() {
  this.layerClient = new LayerAPI({
    token: API_TOKEN,
    appId: APP_ID
  });
};

ParticipantsController.prototype.setupResource = function(route) {
  route.get((req, res)=> {
    var headers = req.headers;
    var authToken = headers['x-auth-token'];
    var layerId = req.params.layerId;
    var currentUser = null, conversations;
    getUserByToken(authToken)
      .then((user) => {
        currentUser = user;
        return this.layerClient.conversations.getAllFromUserAsync(layerId)
      })
      .then((layerResponse) => {
        conversations = layerResponse.body;
        return conversations.length > 0?
          this.verifyParticipants(currentUser, conversations[0]) : OK;
      })
      .then((status) => {
        res.status(status);
        res.json(conversations);
      })
      .catch((err) => this.errorHandler(err, res));
  });
};

ParticipantsController.prototype.verifyParticipants = function(user, conversation) {
  var layerId = user.layerId;
  var results = conversation.participants.filter((uid)=> uid == layerId);
  if (results.length > 0) {
    return Promise.resolve(OK);
  } else {
    return this.layerClient.conversations
          .addParticipantsAsync(conversation.id, [layerId])
          .then(() => this.updateMetadata(conversation, user) )
          .then(() => Promise.resolve(CREATED));
  }
};

ParticipantsController.prototype.updateMetadata = function(conversation, user) {
  var appParticipants = conversation.metadata.appParticipants;
  var metaData = {}, maxIndex, idx = 0;
  Object.keys(appParticipants).forEach((i) => {
    idx = i;
    metaData[`appParticipants.${i}`] = appParticipants[i];
  });
  maxIndex = parseInt(idx) + 1;
  metaData[`appParticipants.${maxIndex}`] =
    userFactoryInstance.serializeToMetadata(user);
  return this.layerClient.conversations
    .setMetadataPropertiesAsync(conversation.id, metaData);
};

ParticipantsController.prototype.errorHandler = function(err, res) {
  if (err.status) res.status(err.status);
  else res.status(500);
  if (err.body) res.json(err.body);
  else if(err.message) res.json({ 'message' : err.message });
  else res.json({ 'status' : 'fail' });
};

module.exports = ParticipantsController;
