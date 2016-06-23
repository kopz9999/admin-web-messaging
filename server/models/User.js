var getRandomInt =
  require('../../shared/Helper').getRandomInt;
var randomColor = require('randomcolor');
var underscored = require("underscore.string/underscored");
var algoliaManagerInstance =
  require('../utils/AlgoliaManager').algoliaManagerInstance;

/*
* TODO: Separate in shared library for isomorphic usage
* - Inheritance between factories for server/client
* */

function User(opts) {
  this.id = opts.id;
  this.objectId = opts.objectId;
  this.layerId = opts.layerId;
  this.displayName = opts.displayName;
  this.color = opts.color;
  this.iconIdentity = opts.iconIdentity;
  this.avatarURL = opts.avatarURL;
}

function UserFactory() {
}

UserFactory.prototype.findOrCreate = function(user) {
  var usersIndex = algoliaManagerInstance.getUsersIndex();
  var query = { facetFilters: "id:" + user.id };
  return usersIndex.search('', query).then((content)=> {
    if (content.nbHits > 0) {
      return this.buildFromAlgolia(content.hits[0]);
    } else {
      return usersIndex.addObject(this.serializeToAlgolia(user)).then((content)=> {
        user.objectId = content.objectID;
        return user;
      });
    }
  });
};

UserFactory.prototype.buildFromRequest = function(opts) {
  return new User({
    id: opts.id,
    layerId: opts.layerId,
    displayName: opts.displayName,
    color: (opts.color || randomColor({hue: 'orange' })),
    iconIdentity: (opts.iconIdentity || getRandomInt(0, 12).toString()),
  });
};

UserFactory.prototype.buildFromBaseAPI = function(opts) {
  return new User({
    id: opts.id,
    layerId: opts.id.toString(),
    displayName: opts.name,
    color: '#a5b0bb',
  });
};

UserFactory.prototype.buildFromAlgolia = function(opts) {
  return new User({
    id: opts.id,
    objectId: opts.objectID,
    layerId: opts.layer_id,
    displayName: opts.display_name,
    color: opts.color,
    iconIdentity: opts.icon_identity,
  });
};

UserFactory.prototype.buildFromLoggedEvent = function(opts) {
  return new User({
    id: opts.uuid,
    layerId: opts.uuid,
    displayName: opts.name,
    color: randomColor({hue: 'orange' }),
    iconIdentity: getRandomInt(0, 12).toString(),
  });
};

UserFactory.prototype.serializeToAlgolia = function(user) {
  var result = {};
  Object.keys(user).forEach((k)=> {
    result[ underscored(k) ] = user[k];
  });
  return result;
};

module.exports = {
  default: User,
  userFactoryInstance: new UserFactory()
};
