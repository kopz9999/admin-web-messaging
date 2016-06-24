// React
import React, { Component } from 'react';
// App
import Visit from '../../components/timeline/Visit';
import Message from '../../components/timeline/Message';
// Constants
import { MESSAGE, VISIT } from '../../constants/EventTypes';

export default class EventComponent extends Component {
  get scrollNode() {
    return document.body;
  }

  scrollToTop() {
    const el = this.scrollNode;
    el.scrollTop = 0;
  }

  renderEventsFeed(opts = {}) {
    const { events, currentUser } = this.props;
    let eventComponents = [];
    events.forEach((event)=> {
      event.addExtraProperties(opts.eventProperties || {});
      switch (event.type) {
        case MESSAGE:
          eventComponents.push(<Message { ...{ ...event, currentUser} } />);
          break;
        case VISIT:
          eventComponents.push(<Visit { ...event } />);
          break;
      }
    });
    return eventComponents;
  }
}
