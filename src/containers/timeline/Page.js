// React
import React, { Component } from 'react';
// App
import TimeLine from '../../components/timeline/TimeLine';
import EventComponent from './EventComponent';

export default class Page extends EventComponent {
  componentDidMount() {
    const { fetchQueryEvents, eventPagination, currentQuery } = this.props;
    fetchQueryEvents(Date.now(), eventPagination, currentQuery);
  }

  render() {
    return (
      <TimeLine>
        {
          this.renderEventsFeed({
            eventProperties: {
              displaySite: false,
              currentPage: true
            }
          })
        }
      </TimeLine>
    );
  }
}
