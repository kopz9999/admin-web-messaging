// Libs
var LayerAPI = require('layer-api');
var HttpStatus = require('http-status-codes');
// App
var getUserByToken = require('../utils/auth').getUserByToken;
var userFactoryInstance = require('../models/User').userFactoryInstance;
var DEFAULT_USER = require('../../shared/App').DEFAULT_USER;
// Locals
var CREATED = HttpStatus.CREATED;
var OK = HttpStatus.OK;
var NOT_FOUND = HttpStatus.NOT_FOUND;
var API_TOKEN = 'PQ4e10cZFRhpU2RQl7HKEbheV39unhkYWQNbVVPb8DTEZhOr';
var APP_ID = 'layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8';

var ParticipantsController = function() {
  this.layerClient = new LayerAPI({
    token: API_TOKEN,
    appId: APP_ID
  });
};

ParticipantsController.prototype.setupResource = function(route) {
  route.post((req, res)=> {
    var layerId = req.params.layerId;
    var user = userFactoryInstance.buildFromRequest(req.body);
    // You can create a conversation for yourself but not for someone else
    user.layerId = layerId;
    return this.findOrCreateConversation(user)
      .then((conversation) => {
        res.status(OK);
        res.json(conversation);
      })
      .catch((err) => this.errorHandler(err, res));
  });

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

ParticipantsController.prototype.findOrCreateConversation = function(user) {
  return this.layerClient.conversations
    .getAllFromUserAsync(user.layerId)
    .then(layerResponse => layerResponse.body[0])
    .catch((err)=> {
      if (err.status === NOT_FOUND) {
        return this.layerClient.conversations
          .createAsync({
            participants: [user.layerId, DEFAULT_USER],
            metadata: {
              "appParticipants.0" :
                userFactoryInstance.serializeToMetadata(user)
            }
          }).then(layerResponse => layerResponse.body);
      } else {
        return Promise.reject(err);
      }
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
