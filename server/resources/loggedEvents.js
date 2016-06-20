var algoliaManagerInstance =
  require('../utils/AlgoliaManager').algoliaManagerInstance;
var userFactoryInstance =
  require('../models/User').userFactoryInstance;

exports.create = function(req, res){
  var index = algoliaManagerInstance.getEventsIndex();
  var loggedEvent = req.body.event;
  var event, user, page, site, loggedUser;
  if (loggedEvent) {
    loggedUser = userFactoryInstance.buildFromLoggedEvent(loggedEvent);
    userFactoryInstance.findOrCreate(loggedUser).then((storedUser)=> {
      user = userFactoryInstance.serializeToAlgolia(storedUser);
      page = { full_url: loggedEvent.url };
      if (loggedEvent.data && loggedEvent.data.title) {
        page.name = loggedEvent.data.title;
      }
      site = { domain: loggedEvent.domain };
      event = { logged_at: Date.now(), site: site, user: user,
        page: page, type: 'VISIT' };
      index.addObject(event, function(err, content) {
        res.send(content);
      });
    }).catch(()=> {
      res.status(422);
      res.send({ message: 'Unknown content'});
    });
  } else {
    res.status(422);
    res.send({ message: 'Unknown content'});
  }
};
