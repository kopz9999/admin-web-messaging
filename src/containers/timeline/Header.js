import React, { Component } from 'react';
import { Link } from 'react-router';
// App Assets
import styles from './Header.css';
import logo from './images/logo.png';
// App Components
import Search from '../../components/timeline/Search';
import Notification from '../../components/timeline/Notification';

export default class Header extends Component {
  renderNewConversation() {
    return (
      <Link to='/home' className={styles.newConversation}>
        <div className={styles.icon}></div>
        <div className={styles.label}>New Conversation</div>
      </Link>
    );
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.leftContent}>
          <Link to='/home' className={styles.logo}>
            <img src={logo} />
          </Link>
          <Search />
        </div>
        <div className={styles.rightContent}>
          { this.renderNewConversation() }
          <Notification />
        </div>
      </div>
    );
  }
}
