// React
import React, { Component } from 'react';
// App
import TimeLine from '../../components/timeline/TimeLine';
import EventComponent from './EventComponent';

export default class Global extends EventComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeoutId: null,
    };
  }

  doFetchEvents() {
    const { eventPagination, eventsIndex, fetchEvents } = this.props;
    fetchEvents(eventsIndex, Date.now(), eventPagination).then(()=> {
      this.state.timeoutId = setTimeout(()=> this.doFetchEvents(), 1000);
    });
  }

  componentDidMount() {
    this.doFetchEvents();
  }

  componentWillUnmount() {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }
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
