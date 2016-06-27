import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Breadcrumb.css';
// App
import Avatar from '../Avatar';

export default class User extends Component {
  render() {
    const { user } = this.props;
    const { displayName, layerId } = user;
    const conversationURL = `/users/${layerId}`;
    const avatarStyle = 'header';

    return (
      <Link to={conversationURL} className={styles.container}>
        <Avatar user={user} customStyle={avatarStyle} />
        <div className={styles.title}> { displayName } </div>
      </Link>
    );
  }
}
