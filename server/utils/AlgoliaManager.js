var algoliasearch = require('algoliasearch');

function AlgoliaManager() {
  this.init();
}

AlgoliaManager.prototype.init = function() {
  var client = algoliasearch('V0L0EPPR59', 'b17514c9ce611a3cf95ff60382d796c5');
  this.eventsIndex = client.initIndex('events_log');
  this.usersIndex = client.initIndex('users');
};

AlgoliaManager.prototype.getEventsIndex = function() {
  return this.eventsIndex;
};

AlgoliaManager.prototype.getUsersIndex = function() {
  return this.usersIndex;
};

module.exports = {
  default: AlgoliaManager,
  algoliaManagerInstance: new AlgoliaManager()
};
