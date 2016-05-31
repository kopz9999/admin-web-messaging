import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
// App Assets
import styles from './Header.css';
import logo from './images/logo.png';
// App Components
import User from '../../components/timeline/header/User';

function mapStateToProps({ users }) {
  return {
    users: users,
  };
}

@connect(mapStateToProps)
export default class Header extends Component {
  renderNewConversation() {
    return (
      <Link to='/home' className={styles.newConversation}>
        <div className={styles.icon}></div>
        <div className={styles.label}>New Conversation</div>
      </Link>
    );
  }

  renderUser() {
    const { layerId, conversationId, users } = this.props;
    const userState = users[layerId];
    if (userState && userState.user) {
      return (
        <User
          conversationId={conversationId}
          user={userState.user}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.leftContent}>
          <Link to='/home' className={styles.logo}>
            <img src={logo} />
          </Link>
          { this.renderUser() }
        </div>
        <div className={styles.rightContent}>
        </div>
      </div>
    );
  }
}
