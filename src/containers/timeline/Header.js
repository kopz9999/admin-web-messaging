import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
// App
import { getLayerConversationId } from '../../utils/Helper';
// App Assets
import styles from './Header.css';
import logo from './images/logo.png';
// App Components
import User from '../../components/timeline/header/User';

function mapStateToProps({ layerUsers }) {
  return {
    layerUsers,
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
    const { layerId, conversationId, layerUsers } = this.props;
    const conversationUsers =
      layerUsers[getLayerConversationId(conversationId)];
    const userState = conversationUsers ? conversationUsers[layerId] : null;
    if (userState && userState.layerUser) {
      return (
        <User
          conversationId={conversationId}
          user={userState.layerUser}
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
