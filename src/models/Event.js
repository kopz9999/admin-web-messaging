import { userFactoryInstance } from './User';
import { pageFactoryInstance } from './Page';
import { siteFactoryInstance } from './Site';
import { messageFactoryInstance } from './Message';

export class Event {
  constructor({key, id, type, isRead, site, user, page, message, receivedAt}) {
    this.key = key;
    this.id = id;
    this.type = type;
    this.isRead = isRead;
    this.site = site;
    this.user = user;
    this.page = page;
    this.message = message;
    this.receivedAt = receivedAt;
  }

  addExtraProperties(extraProps = {}) {
    Object.keys(extraProps).forEach((k) => {
      this[k] = extraProps[k];
    });
  }
}

export class EventFactory {
  get settings() {
    return this._settings;
  }

  set settings(value) {
    this._settings = value;
  }

  get identity() {
    return this._identity;
  }

  set identity(value) {
    this._identity = value;
  }

  constructor() {
    this._identity = 0;
    this._settings = null;
  }

  buildFromAPI(opts) {
    const message = opts.content.message ?
      messageFactoryInstance.buildFromEvent(opts.content.message) : null;
    const { uniqueEvents } = this.settings;

    return new Event({
      key: (uniqueEvents ? ++this.identity : opts.id),
      id: opts.id,
      type: opts.type,
      isRead: opts.is_viewed,
      site: siteFactoryInstance.buildFromEvent(opts.site),
      user: userFactoryInstance.buildFromEvent(opts.user),
      page: pageFactoryInstance.buildFromEvent(opts.content.page),
      message,
      receivedAt: new Date(opts.logged_at)
    });
  }

  buildFromAPICollection(requestEvents) {
    return requestEvents.map( (re) => this.buildFromAPI(re) );
  }
}

export const eventFactoryInstance = new EventFactory();
