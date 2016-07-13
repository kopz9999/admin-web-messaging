import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
// App
import { trimUserName, toUUID } from '../../utils/Helper';
import { MAX_USER_SIZE } from '../../utils/constants';
import styles from './Message.css';
import EventTimestamp from './EventTimestamp';
import Avatar from './Avatar';
import TimeLineItem from './TimeLineItem';
import FollowButton from './FollowButton';

export default class Message extends TimeLineItem {
  renderConversationUser(user) {
    const { currentUser } = this.props;
    const displayNameText = currentUser.layerId == user.layerId ?
      'You' : trimUserName(user.displayName, MAX_USER_SIZE, '...');
    return (
      <span className={styles.linkLabel}>{ displayNameText }</span>
    )
  }

  renderConversationUsers() {
    const { users, backendUser, user } = this.props;
    let visibleUsers = users;
    if (backendUser) {
      visibleUsers = [user];
      users.forEach((u) => {
        if (u.layerId != backendUser.layerId) visibleUsers.push(u);
      });
    }
    if (visibleUsers.length == 0) {
      return null;
    } else {
      return (
        <div className={styles.metadataExtra}>
          <div className={styles.metaDataLabel}> with </div>
          { this.renderConversationUser(visibleUsers[0]) }
        </div>
      )
    }
  }

  render() {
    const { receivedAt, backendUser } = this.props;
    const { layerId } = this.props.user;
    const conversationURL = `/users/${layerId}`;
    const displayUser = backendUser ? backendUser : this.props.user;

    return (
      <Link to={conversationURL} className={styles.message}
           style={this.inlineStyles}>
        <div className={styles.leftElement}>
          <Avatar user={displayUser} />
        </div>
        <div className={styles.rightElement}>
          <div className={styles.title}>
            <EventTimestamp eventAt={receivedAt} />
          </div>
          <div className={styles.metaData}>
            { this.renderConversationUser(displayUser) }
            <div className={styles.metaDataLabel}> replied to a </div>
            <span className={styles.linkLabel}>
              conversation
            </span>
            { this.renderConversationUsers() }
          </div>
          <div className={styles.actionBtn}>
            <i className={styles.replyIcon}>&nbsp;</i>
            <span className={styles.linkLabel}>Reply</span>
          </div>
          <FollowButton subject={displayUser} />
        </div>
      </Link>
    );
  }
}
