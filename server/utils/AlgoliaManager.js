var algoliasearch = require('algoliasearch');

function AlgoliaManager() {
  this.init();
}

AlgoliaManager.prototype.init = function() {
  var client = algoliasearch('V0L0EPPR59', 'b17514c9ce611a3cf95ff60382d796c5');
  this.eventsIndex = client.initIndex('events_log');
  this.usersIndex = client.initIndex('users');
  this.pagesIndex = client.initIndex('pages');
  this.sitesIndex = client.initIndex('sites');
};

AlgoliaManager.prototype.getEventsIndex = function() {
  return this.eventsIndex;
};

AlgoliaManager.prototype.getUsersIndex = function() {
  return this.usersIndex;
};

AlgoliaManager.prototype.getPagesIndex = function() {
  return this.pagesIndex;
};

AlgoliaManager.prototype.getSitesIndex = function() {
  return this.sitesIndex;
};

module.exports = {
  default: AlgoliaManager,
  algoliaManagerInstance: new AlgoliaManager()
};
