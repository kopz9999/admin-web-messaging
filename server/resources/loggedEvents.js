var algoliaManagerInstance =
  require('../utils/AlgoliaManager').algoliaManagerInstance;
var eventFactoryInstance =
  require('../models/Event').eventFactoryInstance;

exports.create = function(req, res){
  var index = algoliaManagerInstance.getEventsIndex();
  var loggedEvent = req.body.event;
  if (loggedEvent) {
    eventFactoryInstance.buildFromLoggedEvent(loggedEvent).then((event)=> {
      return index.addObject(eventFactoryInstance.serializeToAlgolia(event)).then((content)=> {
        event.objectId = content.objectID;
        res.send(event);
      });
    });
  } else {
    res.status(422);
    res.send({ message: 'Unknown content'});
  }
};
