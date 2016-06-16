var algoliaManagerInstance =
  require('../utils/AlgoliaManager').algoliaManagerInstance;

exports.create = function(req, res){
  var index = algoliaManagerInstance.getEventsIndex();
  index.addObject(req.body, function(err, content) {
    res.send(content);
  });
};
