import React, { Component } from 'react';
import styles from './TimeLine.css';
// App
import FeedButton from './FeedButton';

export default class TimeLine extends Component {
  render() {
    return (
      <section className={styles.timeLine}>
        <FeedButton  />
        <div className={styles.container}>
          {this.props.children}
        </div>
      </section>
    );
  }
}
