// React
import React, { Component } from 'react';
// App
import TimeLine from '../../components/timeline/TimeLine';
import EventComponent from './EventComponent';

export default class Page extends EventComponent {
  componentDidMount() {
    const { fetchQueryEvents, eventPagination, query } = this.props;
    fetchQueryEvents(Date.now(), eventPagination, query);
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
