import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './Avatar.css';

export default class Avatar extends Component {
  static propTypes = {
    upperCase: React.PropTypes.bool,
  };

  static defaultProps = {
    upperCase: true,
  };

  renderAvatarURL() {
    const { avatarURL } = this.props.user;
    return (
      <img className={styles.image}  src={avatarURL} />
    );
  }

  renderIconIdentity() {
    const { iconIdentity } = this.props.user;
    const avatarURL = require(`./avatar-images/${iconIdentity}.png`);

    return (
      <img className={styles.iconIdentity} src={avatarURL} />
    );
  }

  render() {
    const { avatarURL } = this.props.user;
    const { customStyle } = this.props;
    const extraStyle = customStyle ? styles[customStyle] : '';
    const avatar = avatarURL ?
      this.renderAvatarURL() : this.renderIconIdentity();
    const wrapperStyle = avatarURL ? '' : styles.default;

    return (
      <div className={`${styles.avatar} ${wrapperStyle} ${extraStyle}`}>
        { avatar }
      </div>
    );
  }
}
