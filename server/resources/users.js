var UsersController = function(route) {
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

