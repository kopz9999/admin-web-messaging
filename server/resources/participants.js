var LayerAPI = require('layer-api');
var API_TOKEN = 'PQ4e10cZFRhpU2RQl7HKEbheV39unhkYWQNbVVPb8DTEZhOr';
var APP_ID = 'layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8';

var ParticipantsController = function() {
  this.layerClient = new LayerAPI({
    token: API_TOKEN,
    appId: APP_ID
  });
};

ParticipantsController.prototype.setupResource = function(route) {
  route.post((req, res) => {
    var user = req.body;
    var conversationId = req.params.conversationId;
    this.layerClient.conversations
      .getAsync(conversationId)
      .then((layerRes)=> this.verifyParticipants(user, layerRes.body))
      .then((status) => {
        res.status(status);
        res.json(user);
      }).catch((err) => this.errorHandler(err, res));
  });
};

ParticipantsController.prototype.verifyParticipants = function(user, conversation) {
  var layerId = user.layerId;
  var results = conversation.participants.filter((uid)=> uid == layerId);
  if (results.length > 0) {
    return Promise.resolve(200);
  } else {
    return this.layerClient.conversations
          .addParticipantsAsync(conversation.id, [layerId])
          .then(() => this.updateMetadata(conversation, user) )
          .then(() => Promise.resolve(201));
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
  metaData[`appParticipants.${maxIndex}`] = user;
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
