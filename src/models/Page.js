export class Page {
  constructor({id, title, thumbnailURL}) {
    this.id = id;
    this.title = title;
    this.thumbnailURL = thumbnailURL;
  }
}

export class PageFactory {
  buildFromAPI(opts) {
    return new Page({
      id: opts.id,
      title: opts.name,
      thumbnailURL: opts.thumbnail_url,
    });
  }

  buildFromEvent(opts) {
    return this.buildFromAPI(opts);
  }
}

export const pageFactoryInstance = new PageFactory();
