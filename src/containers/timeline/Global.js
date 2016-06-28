// React
import React, { Component } from 'react';
// App
import TimeLine from '../../components/timeline/TimeLine';
import EventComponent from './EventComponent';

export default class Global extends EventComponent {
  componentWillMount() {
    this.props.liveFetchEvents();
    this.scrollToTop();
  }

  componentWillUnmount() {
    this.props.doClearEventsTimeout();
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
