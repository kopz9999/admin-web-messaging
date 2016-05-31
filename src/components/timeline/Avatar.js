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

  /* TODO: Improve solution */
  componentDidMount() {
    const backgroundColor = '#a5b0bb';
    const domNode = findDOMNode(this);
    const letterElement = domNode.getElementsByClassName( styles.letter )[0];
    if (letterElement) {
      letterElement.style.backgroundColor = backgroundColor;
    }
  }

  renderInitials() {
    const { displayName } = this.user;

    return (
      <div className={styles.letter}>
        { displayName[0].toLowerCase() }
      </div>
    );
  }

  render() {
    const { avatarURL } = this.user;
    const { customStyle } = this.props;
    const extraStyle = customStyle ? styles[customStyle] : '';
    const avatar = avatarURL == null ?
      this.renderInitials() : this.renderAvatarURL();

    return (
      <div className={`${styles.avatar} ${extraStyle}`}>
        { avatar }
      </div>
    );
  }
}
