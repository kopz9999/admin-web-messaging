import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './Avatar.css';

export default class Avatar extends Component {
  get user() {
    return this.props.user;
  }

  renderAvatarURL() {
    const { avatarURL } = this.user;
    return (
      <img className={styles.image} src={avatarURL} />
    );
  }

  renderInitials() {
    const { displayName, color } = this.user;
    const inlineStyles = { backgroundColor: color };

    return (
      <div className={styles.letter} style={inlineStyles}>
        { displayName[0].toLowerCase() }
      </div>
    );
  }

  render() {
    const { avatarURL } = this.user;
    const { customStyle } = this.props;
    const extraStyle = customStyle ? styles[customStyle] : '';
    const avatar = avatarURL ?
      this.renderAvatarURL() : this.renderInitials();

    return (
      <div className={`${styles.avatar} ${extraStyle}`}>
        { avatar }
      </div>
    );
  }
}
