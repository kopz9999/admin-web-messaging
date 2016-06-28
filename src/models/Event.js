import { userFactoryInstance } from './User';
import { pageFactoryInstance } from './Page';
import { siteFactoryInstance } from './Site';
import { messageFactoryInstance } from './Message';

export class Event {
  constructor({key, id, type, isRead, site, user, users, backendUser, page, message,
      receivedAt, layerMessage}) {
    this.key = key;
    this.id = id;
    this.type = type;
    this.isRead = isRead;
    this.site = site;
    this.user = user;
    this.backendUser = backendUser;
    this.users = users || [];
    this.page = page;
    this.message = message;
    this.layerMessage = layerMessage;
    this.receivedAt = receivedAt;
  }

  generateLayerMessage() {
    this.layerMessage = {
      id: this.message.id,
      parts: [ { body: this.message.body } ],
      sentAt: new Date(this.receivedAt),
      sender: {
        userId: this.backendUser ? this.backendUser.layerId : this.user.layerId
      }
    };
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
      message,
      receivedAt: new Date(opts.logged_at)
    });
  }

  buildFromAlgolia(opts) {
    const message = opts.message ?
      messageFactoryInstance.buildFromEvent(opts.message) : null;

    return new Event({
      key: opts.objectID,
      id: opts.objectID,
      type: opts.type,
      message,
      receivedAt: new Date(opts.logged_at)
    });
  }

  buildFromAPICollection(requestEvents) {
    return requestEvents.map( (re) => this.buildFromAPI(re) );
  }
}

export const eventFactoryInstance = new EventFactory();
