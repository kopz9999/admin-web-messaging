import React, { Component } from 'react';
import { timeSinceCompose } from '../../utils/Helper';
import styles from './EventTimestamp.css';

export default class EventTimestamp extends Component {
  render() {
    const { eventAt } = this.props;
    const lastTextSinceString = timeSinceCompose(eventAt);
    return (
      <div className={styles.eventTimestamp}>
        { lastTextSinceString }
      </div>
    );
  }
}