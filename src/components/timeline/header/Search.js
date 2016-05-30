import React, { Component } from 'react';
import styles from './Search.css';

export default class Search extends Component {
  render() {
    return (
      <div className={styles.search}>
        <div className={styles.icon}></div>
        <input className={styles.text} type="text" placeholder="Search" />
      </div>
    );
  }
}
