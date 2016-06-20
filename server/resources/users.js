var userFactoryInstance =
  require('../models/User').userFactoryInstance;

var UsersController = function() {
};

UsersController.prototype.setupResource = function(route) {
  route.post((req, res) => {
    var user = userFactoryInstance.buildFromRequest(req.body);
    userFactoryInstance.findOrCreate(user).then((storedUser)=> {
      res.status(200);
      res.json(storedUser);
    }).catch(()=> {
      res.status(422);
      res.send({ message: 'Unknown content'});
    });
  });
};

module.exports = UsersController;
