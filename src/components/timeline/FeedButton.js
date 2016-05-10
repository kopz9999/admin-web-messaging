import React, { Component } from 'react';
import styles from './FeedButton.css';

export default class FeedButton extends Component {
  render() {
    const newEvents = 5;
    return (
      <div className={styles.feedButton}>
        <div className={styles.leftElement}>
          <div className={styles.btn}>
          </div>
        </div>
        <div className={styles.rightElement}>
          <div className={styles.eventsLabel}>
            { newEvents } New Events -&nbsp;
          </div>
          <div className={styles.loadLabel}>
            Load More
          </div>
        </div>
      </div>
    )
  }
}