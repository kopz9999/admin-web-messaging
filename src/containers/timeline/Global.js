// React
import React, { Component } from 'react';
// App
import TimeLine from '../../components/timeline/TimeLine';
import EventComponent from './EventComponent';

export default class Global extends EventComponent {
  componentDidMount() {
    const { fetchEvents, eventPagination, eventsIndex } = this.props;
    fetchEvents(eventsIndex, Date.now(), eventPagination);
  }

  render() {
    return (
      <TimeLine hasFeedButton={false}>
        {
          this.renderEventsFeed({
            eventProperties: {
              displaySite: true
            }
          })
        }
      </TimeLine>
    );
  }
}
