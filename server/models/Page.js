var underscored = require("underscore.string/underscored");
var algoliaManagerInstance =
  require('../utils/AlgoliaManager').algoliaManagerInstance;

function Page(opts) {
  this.objectId = opts.objectId;
  this.fullURL = opts.fullURL;
  this.name = opts.name;
  this.siteId = opts.siteId;
}

function PageFactory() {
}

PageFactory.prototype.findOrCreate = function(page) {
  var pagesIndex = algoliaManagerInstance.getPagesIndex();
  var query = { facetFilters: ["site_id:" + page.siteId,
    "full_url:" + page.fullURL] };
  return pagesIndex.search('', query).then((content)=> {
    if (content.nbHits > 0) {
      return this.buildFromAlgolia(content.hits[0]);
    } else {
      return pagesIndex.addObject(this.serializeToAlgolia(page)).then((content)=> {
        page.objectId = content.objectID;
        return page;
      });
    }
  });
};

PageFactory.prototype.buildFromAlgolia = function(opts) {
  return new Page({
    objectId: opts.objectID,
    fullURL: opts.full_url,
    name: opts.name,
    siteId: opts.site_id,
  });
};

PageFactory.prototype.buildFromLoggedEvent = function(opts) {
  return new Page({
    fullURL: opts.url,
    name: ((opts.data && opts.data.title) ? opts.data.title : 'Unknown'),
  });
};

PageFactory.prototype.serializeToAlgolia = function(page) {
  var result = {};
  Object.keys(page).forEach((k)=> {
    result[ underscored(k) ] = page[k];
  });
  return result;
};

module.exports = {
  default: Page,
  pageFactoryInstance: new PageFactory()
};

