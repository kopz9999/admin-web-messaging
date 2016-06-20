import React, { Component } from 'react';
import { Link } from 'react-router';

import { trimUserName } from '../../utils/Helper';
import { MAX_USER_SIZE } from '../../utils/constants';
import styles from './Message.css';
import EventTimestamp from './EventTimestamp';
import Avatar from './Avatar';
import TimeLineItem from './TimeLineItem';

export default class Visit extends TimeLineItem {
  render() {
    const { user, page, receivedAt } = this.props;
    const displayNameText = trimUserName(user.displayName, MAX_USER_SIZE, '...');
    const pageName = page.name;

    return (
      <Link to='/home' className={styles.message}
            style={this.inlineStyles}>
        <div className={styles.leftElement}>
          <Avatar user={user} />
        </div>
        <div className={styles.rightElement}>
          <div className={styles.title}>
            <EventTimestamp eventAt={receivedAt} />
          </div>
          <div className={styles.metaData}>
            <span className={styles.linkLabel}>{ displayNameText }</span>
            <div className={styles.metaDataLabel}> visited </div>
            <span className={styles.linkLabel}>
              { pageName }
            </span>
          </div>
          <div className={styles.actionBtn}>
            <i className={styles.conversationIcon}>&nbsp;</i>
            <span className={styles.linkLabel}>Start Conversation</span>
          </div>
        </div>
      </Link>
    );
  }
}
