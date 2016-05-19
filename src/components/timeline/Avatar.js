import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './Avatar.css';
import randomColor from 'randomcolor';

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
    const backgroundColor = randomColor({hue: 'red'});
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
    const { isRead } = this.props;
    const extraStyle = isRead ? '' : styles.unread;
    const avatar = avatarURL == null ?
      this.renderInitials() : this.renderAvatarURL();

    return (
      <div className={`${styles.avatar} ${extraStyle}`}>
        { avatar }
      </div>
    );
  }
}
