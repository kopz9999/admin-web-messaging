import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Breadcrumb.css';

export default class Site extends Component {
  render() {
    const { site } = this.props;
    const { id, title, thumbnailURL } = site;

    return (
      <Link to={`/sites/${id}`} className={styles.container}>
        <div className={styles.icon}>
          <img src={thumbnailURL} />
        </div>
        <div className={styles.title}> { title } </div>
      </Link>
    );
  }
}
