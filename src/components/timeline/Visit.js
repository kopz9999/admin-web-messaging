import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './Visit.css';
import EventTimestamp from './EventTimestamp';
import Avatar from './Avatar';
import SiteAvatar from './SiteAvatar';
import TimeLineItem from './TimeLineItem';

export default class Visit extends TimeLineItem {
  get user() {
    return this.props.user;
  }

  get page() {
    return this.props.page;
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
        <div className={styles.metaDataLabel}> Viewed from this page </div>
      );
    } else {
      return (
        <div className={styles.originInformation}>
          <div className={styles.metaDataLabel}> Viewed: </div>
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
    const { title } = this.page;
    const siteTitle = this.site.title;
    const siteId = this.site.id;
    const pageId = this.page.id;
    const { receivedAt, isRead, displaySite } = this.props;
    const siteIcon = displaySite ? (<SiteAvatar site={this.site} />) : null;
    const readStyle = isRead ? '' : styles.unread;
    const avatarStyle = isRead ? '' : 'unread';
    const displaySiteStyle = displaySite ? styles.displaySite : '';

    return (
      <div className={`${styles.visit} ${readStyle} ${displaySiteStyle}`}>
        <div className={styles.leftElement}>
          <Avatar user={this.user} customStyle={avatarStyle} />
          { siteIcon }
        </div>
        <div className={styles.rightElement}>
          <div className={styles.title}>
            <div className={styles.displayName}> {displayName} </div>
            <EventTimestamp eventAt={receivedAt} />
          </div>
          <div className={styles.metaData}>
            <div className={styles.icon}></div>
            { this.renderOriginInformation() }
          </div>
        </div>
      </div>
    );
  }
}
