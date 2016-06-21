var userFactoryInstance =
  require('./User').userFactoryInstance;
var siteFactoryInstance =
  require('./Site').siteFactoryInstance;
var pageFactoryInstance =
  require('./Page').pageFactoryInstance;

function TimeLineEvent(opts) {
  this.objectId = opts.objectId;
  this.loggedAt = opts.loggedAt;
  this.site = opts.site;
  this.user = opts.user;
  this.page = opts.page;
  this.type = opts.type;
}

function EventFactory() {
}

EventFactory.prototype.buildFromLoggedEvent = function(opts) {
  var loggedUser = userFactoryInstance.buildFromLoggedEvent(opts);
  var loggedSite = siteFactoryInstance.buildFromLoggedEvent(opts);
  var loggedPage = pageFactoryInstance.buildFromLoggedEvent(opts);
  var promises = [userFactoryInstance.findOrCreate(loggedUser),
    siteFactoryInstance.findOrCreate(loggedSite)];
  var event = new TimeLineEvent({
    loggedAt: Date.now(),
    type: 'VISIT',
  });
  return Promise.all(promises).then(values => {
    event.user = values[0];
    event.site = values[1];
    loggedPage.siteId = event.site.objectId;
    return pageFactoryInstance.findOrCreate(loggedPage).then((storedPage)=> {
      event.page = storedPage;
      return event;
    });
  });
};

EventFactory.prototype.serializeToAlgolia = function(event) {
  return {
    logged_at: event.loggedAt,
    site: siteFactoryInstance.serializeToAlgolia(event.site),
    user: userFactoryInstance.serializeToAlgolia(event.user),
    page: pageFactoryInstance.serializeToAlgolia(event.page),
    type: event.type,
  };
};

module.exports = {
  default: TimeLineEvent,
  eventFactoryInstance: new EventFactory()
};

