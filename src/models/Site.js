export class Site {
  constructor({id, title, thumbnailURL}) {
    this.id = id;
    this.title = title;
    this.thumbnailURL = thumbnailURL;
  }
}

export class SiteFactory {
  buildFromAPI(opts) {
    return new Site({
      id: opts.object_id,
      title: opts.name,
      thumbnailURL: opts.thumbnail_url,
    });
  }

  buildFromEvent(opts) {
    return this.buildFromAPI(opts);
  }
}

export const siteFactoryInstance = new SiteFactory();
