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
  this.backendUser = opts.backendUser;
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
    if (event.page) {
      event.page.siteId = event.site.objectId;
      return pageFactoryInstance.findOrCreate(event.page).then((storedPage)=> {
        event.page = storedPage;
        return event;
      });
    } else {
      return event;
    }
  });
};

EventFactory.prototype.buildFromAlgolia = function(opts) {
  var event = new TimeLineEvent({
    loggedAt: opts.logged_at,
    type: opts.type,
    user: userFactoryInstance.buildFromAlgolia(opts.user),
    site: (opts.site ? siteFactoryInstance.buildFromAlgolia(opts.site) : null),
    page: (opts.page ? pageFactoryInstance.buildFromAlgolia(opts.page) : null),
    backendUser: opts.backend_user,
    message: opts.message,
    users: opts.users,
  });
  if (event.site) {
    return this.retrieveProperties(event);
  } else {
    return userFactoryInstance.findOrCreate(event.user).then((user)=> {
      event.user = user;
      return event;
    });
  }
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
    user: userFactoryInstance.serializeToAlgolia(event.user),
    site: (event.site ? siteFactoryInstance.serializeToAlgolia(event.site) : null),
    page: (event.page ? pageFactoryInstance.serializeToAlgolia(event.page) : null),
    type: event.type,
    message: event.message,
    users: event.users,
    backend_user: event.backendUser,
  };
};

module.exports = {
  default: TimeLineEvent,
  eventFactoryInstance: new EventFactory()
};

