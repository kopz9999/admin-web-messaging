import React, { Component } from 'react';
import styles from './Notification.css';

export default class Notification extends Component {
  render() {
    const number = 12;
    return (
      <div className={styles.notification}>
        <div className={styles.icon}></div>
        <div className={styles.balloon}>{number}</div>
      </div>
    );
  }
}
