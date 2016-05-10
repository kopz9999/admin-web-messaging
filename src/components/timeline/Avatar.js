import React, { Component } from 'react';
import styles from './Avatar.css';
import { generatePastelColors } from '../../utils/Helper';

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
    const { displayName } = this.user;
    const backgroundColor = generatePastelColors( displayName );
    const divStyles = { backgroundColor: '#ff3f5f' };

    return (
      <div className={styles.letter} style={divStyles} >
        { displayName[0].toLowerCase() }
      </div>
    );
  }

  render() {
    const { avatarURL } = this.user;
    const avatar = avatarURL == null ?
      this.renderInitials() : this.renderAvatarURL();
    return (
      <div className={styles.avatar}>
        { avatar }
      </div>
    );
  }
}
