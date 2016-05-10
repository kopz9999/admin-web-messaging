import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Visit.css';
import EventTimestamp from './EventTimestamp';
import Avatar from './Avatar';

export default class Visit extends Component {
  get user() {
    return this.props.user;
  }

  get page() {
    return this.props.page;
  }

  render() {
    const { displayName } = this.user;
    const { title } = this.page;
    const { receivedAt } = this.props;

    return (
      <div className={styles.visit}>
        <div className={styles.leftElement}>
          <Avatar user={this.user} />
        </div>
        <div className={styles.rightElement}>
          <div className={styles.title}>
            <div className={styles.displayName}> {displayName} </div>
            <EventTimestamp eventAt={receivedAt} />
          </div>
          <div className={styles.metaData}>
            <div className={styles.icon}></div>
            <div className={styles.metaDataLabel}> Viewed: </div>
            <Link to='/home' className={styles.linkLabel}> {title} </Link>
          </div>
        </div>
      </div>
    );
  }
}
