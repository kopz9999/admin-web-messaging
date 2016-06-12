// React
import React, { Component } from 'react';
// App
import Visit from '../../components/timeline/Visit';
import Message from '../../components/timeline/Message';
// Constants
import { MESSAGE, PAGE } from '../../constants/EventTypes';

export default class EventComponent extends Component {
  renderEventsFeed(opts = {}) {
    const { events, currentUser } = this.props;
    let eventComponents = [];
    events.forEach((event)=> {
      event.addExtraProperties(opts.eventProperties || {});
      switch (event.type) {
        case MESSAGE:
          eventComponents.push(<Message { ...{ ...event, currentUser} } />);
        break;
        // case PAGE:
        //   eventComponents.push(<Visit { ...event } />);
      }
    });
    return eventComponents;
  }
}
