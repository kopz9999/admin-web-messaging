var algoliaManagerInstance =
  require('../utils/AlgoliaManager').algoliaManagerInstance;
var eventFactoryInstance =
  require('../models/Event').eventFactoryInstance;

function onError(err, res) {
  res.status(422);
  res.send({ message: 'Unknown content'});
}

exports.create = function(req, res){
  var index = algoliaManagerInstance.getEventsIndex();
  var rawEvent = req.body;
  if (rawEvent.user) {
    rawEvent.user.id = rawEvent.user.id || rawEvent.user.layer_id; // TODO: Remove this validation
    eventFactoryInstance.buildFromAlgolia(rawEvent).then(event => {
      return index.addObject(eventFactoryInstance.serializeToAlgolia(event)).then((content)=> {
        event.objectId = content.objectID;
        res.send(event);
      });
    }).catch(err => onError(err, res) );
  } else {
    onError(null, res);
  }
};
