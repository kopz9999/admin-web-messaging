import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
// App
import styles from './Avatar.css';

export default class SiteAvatar extends Component {
  get site() {
    return this.props.site;
  }

  render() {
    const { thumbnailURL, id } = this.site;

    return (
      <Link to={`/sites/${id}`} className={`${styles.avatar} ${styles.site}`}>
        <img className={styles.image} src={thumbnailURL} />
      </Link>
    );
  }
}
