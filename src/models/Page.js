export class Page {
  constructor({id, siteId, title, thumbnailURL, fullURL}) {
    this.id = id;
    this.siteId = siteId;
    this.title = title;
    this.thumbnailURL = thumbnailURL;
    this.fullURL = fullURL;
  }
}

export class PageFactory {
  buildFromAPI(opts) {
    return new Page({
      id: opts.object_id,
      siteId: opts.site_id,
      title: opts.name,
      thumbnailURL: opts.thumbnail_url,
    });
  }

  buildFromAlgolia(opts) {
    return new Page({
      id: opts.objectID,
      siteId: opts.site_id,
      title: opts.name,
      fullURL: opts.full_url,
      thumbnailURL: opts.thumbnail_url || 'https://s3-us-west-2.amazonaws.com/kopz-projects/Curaytor/Messenger/pageBreadcrumb.PNG',
    });
  }

  buildFromEvent(opts) {
    return this.buildFromAPI(opts);
  }
}

export const pageFactoryInstance = new PageFactory();
