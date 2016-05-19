import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
// App
import { cutString, trimUserName } from '../../../utils/Helper';
import { MAX_TEXT_SIZE, MAX_USER_SIZE } from '../../../utils/constants';
import styles from '../Message.css';
import EventTimestamp from '../EventTimestamp';
import Avatar from '../Avatar';

export default class Message extends Component {
  get user() {
    return this.props.user;
  }

  get message() {
    return this.props.message;
  }

  componentDidMount() {
    const domNode = findDOMNode(this);
    this.props.onRenderNode(domNode);
  }

  render() {
    const { displayName } = this.user;
    const { parts, sentAt } = this.message;
    const { isRead } = this.props;
    const bodyText = parts[0] ? parts[0].body : '';
    const displayNameText = trimUserName(displayName, MAX_USER_SIZE, '...');

    return (
      <div className={`${styles.message}`}>
        <div className={styles.leftElement}>
          <Avatar user={this.user} />
        </div>
        <div className={styles.rightElement}>
          <div className={styles.title}>
            <div className={styles.displayName}> {displayNameText} </div>
            <EventTimestamp eventAt={sentAt} />
          </div>
          <div className={styles.messageBody}>
            { bodyText }
          </div>
        </div>
      </div>
    );
  }
}
