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
  this.message = opts.message;
  this.users = opts.users;
}

function EventFactory() {
}

EventFactory.prototype.retrieveProperties = function (event) {
  var promises = [userFactoryInstance.findOrCreate(event.user),
    siteFactoryInstance.findOrCreate(event.site)];
  return Promise.all(promises).then(values => {
    event.user = values[0];
    event.site = values[1];
    event.page.siteId = event.site.objectId;
    return pageFactoryInstance.findOrCreate(event.page).then((storedPage)=> {
      event.page = storedPage;
      return event;
    });
  });
};

EventFactory.prototype.buildFromAlgolia = function(opts) {
  var event = new TimeLineEvent({
    loggedAt: opts.logged_at,
    type: opts.type,
    user: userFactoryInstance.buildFromAlgolia(opts.user),
    site: siteFactoryInstance.buildFromAlgolia(opts.site),
    page: pageFactoryInstance.buildFromAlgolia(opts.page),
    message: opts.message,
    users: opts.users,
  });
  return this.retrieveProperties(event);
};

EventFactory.prototype.buildFromLoggedEvent = function(opts) {
  var event = new TimeLineEvent({
    loggedAt: Date.now(),
    type: 'VISIT',
    user: userFactoryInstance.buildFromLoggedEvent(opts),
    site: siteFactoryInstance.buildFromLoggedEvent(opts),
    page: pageFactoryInstance.buildFromLoggedEvent(opts),
  });
  return this.retrieveProperties(event);
};

EventFactory.prototype.serializeToAlgolia = function(event) {
  return {
    logged_at: event.loggedAt,
    site: siteFactoryInstance.serializeToAlgolia(event.site),
    user: userFactoryInstance.serializeToAlgolia(event.user),
    page: pageFactoryInstance.serializeToAlgolia(event.page),
    type: event.type,
    message: event.message,
    users: event.users,
  };
};

module.exports = {
  default: TimeLineEvent,
  eventFactoryInstance: new EventFactory()
};

