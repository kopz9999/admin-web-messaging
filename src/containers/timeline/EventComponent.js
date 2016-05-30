// React
import React, { Component } from 'react';
// App
import Visit from '../../components/timeline/Visit';
import Message from '../../components/timeline/Message';
// Constants
import { MESSAGE, PAGE } from '../../constants/EventTypes';

export default class EventComponent extends Component {
  renderEventsFeed(opts = {}) {
    const { events } = this.props;
    return events.map((event)=> {
      event.addExtraProperties(opts.eventProperties || {});
      switch (event.type) {
        case MESSAGE:
          return (<Message { ...event } />);
        case PAGE:
          return (<Visit { ...event } />);
        default:
          return null;
      };
    });
  }
}
