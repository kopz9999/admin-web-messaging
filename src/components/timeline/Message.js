import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
// App
import { cutString, trimUserName, toUUID } from '../../utils/Helper';
import { MAX_TEXT_SIZE, MAX_USER_SIZE } from '../../utils/constants';
import styles from './Message.css';
import EventTimestamp from './EventTimestamp';
import Avatar from './Avatar';
import SiteAvatar from './SiteAvatar';
import TimeLineItem from './TimeLineItem';

export default class Message extends TimeLineItem {
  get user() {
    return this.props.user;
  }

  get page() {
    return this.props.page;
  }

  get message() {
    return this.props.message;
  }

  get site() {
    return this.props.site;
  }

  renderOriginInformation() {
    const { currentPage } = this.props;
    const { title } = this.page;
    const siteTitle = this.site.title;
    const siteId = this.site.id;
    const pageId = this.page.id;

    if (currentPage) {
      return (
        <div className={styles.metaDataLabel}> from this page </div>
      );
    } else {
      return (
        <div className={styles.originInformation}>
          <div className={styles.metaDataLabel}> from </div>
          <Link to={`/sites/${siteId}/pages/${pageId}`} className={styles.linkLabel}> {title} </Link>
          <div className={styles.metaDataLabel}> on </div>
          <Link to={`/sites/${siteId}`} className={styles.linkLabel}> {siteTitle} </Link>
          <div className={styles.metaDataLabel}> website </div>
        </div>
      );
    }
  }

  render() {
    const { displayName } = this.user;
    const { body, conversationId } = this.message;
    const siteId = this.site.id;
    const pageId = this.page.id;
    const userId = this.user.id;
    const { receivedAt, isRead, displaySite } = this.props;
    const bodyText = cutString(body, MAX_TEXT_SIZE, '...');
    const displayNameText = trimUserName(displayName, MAX_USER_SIZE, '...');
    const readStyle = isRead ? '' : styles.unread;
    const displaySiteStyle = displaySite ? styles.displaySite : '';
    const avatarStyle = isRead ? '' : 'unread';
    const siteIcon = displaySite ? (<SiteAvatar site={this.site} />) : null;
    const layerUUID = toUUID(conversationId);
    const conversationURL = `/sites/${siteId}/pages/${pageId}/users/${userId}` +
      `/conversations/${layerUUID}`;

    return (
      <div className={`${styles.message} ${readStyle} ${displaySiteStyle}`}
           style={this.inlineStyles}>
        <div className={styles.leftElement}>
          <Avatar user={this.user} customStyle={avatarStyle} />
          { siteIcon }
        </div>
        <div className={styles.rightElement}>
          <div className={styles.title}>
            <div className={styles.displayName}> {displayNameText} </div>
            <EventTimestamp eventAt={receivedAt} />
          </div>
          <div className={styles.metaData}>
            <div className={styles.icon}></div>
            <div className={styles.metaDataLabel}> Sent </div>
            <Link to={conversationURL} className={styles.linkLabel}> message </Link>
            { this.renderOriginInformation() }
          </div>
          <div className={styles.messageBody}>
            { bodyText }
          </div>
          <Link to={conversationURL} className={styles.replyBtn}> Reply </Link>
        </div>
      </div>
    );
  }
}
