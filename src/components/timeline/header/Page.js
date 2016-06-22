import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Breadcrumb.css';

export default class Page extends Component {
  render() {
    const { page, siteId } = this.props;
    const { id, title, thumbnailURL } = page;

    return (
      <Link to={`/sites/${siteId}/pages/${id}`} className={styles.container}>
        <div className={styles.icon}>
          <img src={thumbnailURL} />
        </div>
        <div className={styles.title}> { title } </div>
      </Link>
    );
  }
}
