var underscored = require("underscore.string/underscored");
var algoliaManagerInstance =
  require('../utils/AlgoliaManager').algoliaManagerInstance;

function Site(opts) {
  this.objectId = opts.objectId;
  this.domain = opts.domain;
}

function SiteFactory() {
}

SiteFactory.prototype.findOrCreate = function(site) {
  var sitesIndex = algoliaManagerInstance.getSitesIndex();
  var query = { facetFilters: "domain:" + site.domain };
  return sitesIndex.search('', query).then((content)=> {
    if (content.nbHits > 0) {
      return this.buildFromAlgolia(content.hits[0]);
    } else {
      return sitesIndex.addObject(this.serializeToAlgolia(site)).then((content)=> {
        site.objectId = content.objectID;
        return site;
      });
    }
  });
};

SiteFactory.prototype.buildFromAlgolia = function(opts) {
  return new Site({
    objectId: opts.objectID,
    domain: opts.domain,
  });
};

SiteFactory.prototype.buildFromLoggedEvent = function(opts) {
  return new Site({
    domain: opts.domain,
  });
};

SiteFactory.prototype.serializeToAlgolia = function(site) {
  var result = {};
  Object.keys(site).forEach((k)=> {
    result[ underscored(k) ] = site[k];
  });
  return result;
};

module.exports = {
  default: Site,
  siteFactoryInstance: new SiteFactory()
};

