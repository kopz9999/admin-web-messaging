import React, { Component } from 'react';
import { Link } from 'react-router';

import { trimUserName } from '../../utils/Helper';
import { MAX_USER_SIZE } from '../../utils/constants';
import styles from './Message.css';
import sharedStyles from './TimeLineItem.css';
import EventTimestamp from './EventTimestamp';
import Avatar from './Avatar';
import TimeLineItem from './TimeLineItem';
import FollowButton from './FollowButton';

export default class Visit extends TimeLineItem {
  render() {
    const { user, page, receivedAt, site, updateParentContainer } = this.props;
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
          <div className={styles.metaData}>
            <Link to={conversationURL} className={styles.metaDataLink}>
              <span className={styles.linkLabel}> { displayNameText } </span>
            </Link>
            <Link to={pageScopeURL} className={styles.metaDataLink}>
              <div className={styles.metaDataLabel}> visited </div>
              <span className={styles.linkLabel}>
                { pageName }
              </span>
            </Link>
          </div>
          <div className={sharedStyles.actionButtons}>
            <FollowButton subject={user}
                          updateParentContainer={updateParentContainer} />
          </div>
        </div>
      </div>
    );
  }
}
