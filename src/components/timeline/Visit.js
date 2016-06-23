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
    const { user, page, receivedAt, site } = this.props;
    const displayNameText = trimUserName(user.displayName, MAX_USER_SIZE, '...');
    const pageName = page.title;
    const pageScopeURL = `/sites/${site.id}/pages/${page.id}`;
    const conversationURL = `/users/${user.layerId}`;

    return (
      <div className={styles.message}
            style={this.inlineStyles}>
        <Link to={conversationURL} className={styles.leftElement}>
          <Avatar user={user} />
        </Link>
        <div className={styles.rightElement}>
          <div className={styles.title}>
            <EventTimestamp eventAt={receivedAt} />
          </div>
          <Link to={pageScopeURL} className={styles.metaData}>
            <span className={styles.linkLabel}>{ displayNameText }</span>
            <div className={styles.metaDataLabel}> visited </div>
            <span className={styles.linkLabel}>
              { pageName }
            </span>
          </Link>
          <Link to={conversationURL} className={styles.actionBtn}>
            <i className={styles.conversationIcon}>&nbsp;</i>
            <span className={styles.linkLabel}>Start Conversation</span>
          </Link>
        </div>
      </div>
    );
  }
}
