export class Page {
  constructor({id, siteId, title, thumbnailURL}) {
    this.id = id;
    this.siteId = siteId;
    this.title = title;
    this.thumbnailURL = thumbnailURL;
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

  buildFromEvent(opts) {
    return this.buildFromAPI(opts);
  }
}

export const pageFactoryInstance = new PageFactory();
