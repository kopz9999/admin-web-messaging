import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Breadcrumb.css';

export default class Page extends Component {
  render() {
    const { title, thumbnailURL, fullURL } = this.props.page;

    return (
      <a href={fullURL} target="blank" className={styles.container}>
        <div className={styles.icon}>
          <img src={thumbnailURL} />
        </div>
        <div className={styles.title}> { title } </div>
      </a>
    );
  }
}
