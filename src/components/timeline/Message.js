import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Message.css';
import EventTimestamp from './EventTimestamp';
import Avatar from './Avatar';

export default class Message extends Component {
  get user() {
    return this.props.user;
  }

  get page() {
    return this.props.page;
  }

  get message() {
    return this.props.message;
  }

  render() {
    const { displayName } = this.user;
    const { title } = this.page;
    const { body } = this.message;
    const { receivedAt } = this.props;

    return (
      <div className={styles.message}>
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
            <div className={styles.metaDataLabel}> Sent </div>
            <Link to='/home' className={styles.linkLabel}> message </Link>
            <div className={styles.metaDataLabel}> from </div>
            <Link to='/home' className={styles.linkLabel}> {title} </Link>
          </div>
          <div className={styles.messageBody}>
            { body }
          </div>
          <Link to='/home' className={styles.replyBtn}> Reply </Link>
        </div>
      </div>
    );
  }
}
