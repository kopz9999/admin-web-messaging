// React
import React, { Component } from 'react';
// App
import Visit from '../../components/timeline/Visit';
import Message from '../../components/timeline/Message';
// Constants
import { MESSAGE, PAGE } from '../../constants/EventTypes';

export default class EventComponent extends Component {
  static eventsIdentity = 0;

  evenToTimeLineItem(event, opts = {}) {
    opts.eventProperties = opts.eventProperties || {};
    const { settings } = this.props;
    const { uniqueEvents } = settings;

    const obj = {
      key: (uniqueEvents ? ++EventComponent.eventsIdentity : event.id),
      isRead: event.is_viewed,
      site: {
        id: event.site.id,
        title: event.site.name,
        thumbnailURL: event.site.thumbnail_url,
      },
      user: {
        id: event.user.id,
        displayName: event.user.display_name,
        color: event.user.color,
        avatarURL: event.user.avatar_url
      },
      page: {
        id: event.content.page.id,
        title: event.content.page.name
      },
      receivedAt: new Date(event.logged_at),
      ...opts.eventProperties,
    };
    if (event.content.message) {
      obj.message = {
        body: event.content.message.body,
        conversationId: event.content.message.conversation_id
      };
    }
    return obj;
  }

  renderPageEvent(event, opts = {}) {
    const pageEvent = this.evenToTimeLineItem(event, opts);

    return (
      <Visit
        { ...pageEvent }
      />
    );
  }

  renderMessageEvent(event, opts = {}) {
    const messageEvent = this.evenToTimeLineItem(event, opts);

    return (
      <Message
        { ...messageEvent }
      />
    );
  }

  renderEventsFeed(opts = {}) {
    const { events } = this.props;
    return events.map((el)=> {
      switch (el.type) {
        case MESSAGE:
          return this.renderMessageEvent(el, opts);
          break;
        case PAGE:
          return this.renderPageEvent(el, opts);
          break;
        default:
          return null;
      };
    });
  }
}
