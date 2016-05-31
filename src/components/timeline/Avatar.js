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
    const { upperCase } = this.props;
    const { displayName, color } = this.user;
    const inlineStyles = { backgroundColor: color };
    const caseStyle = upperCase ? styles.upperCase : '';

    return (
      <div className={`${styles.letter} ${caseStyle}`} style={inlineStyles}>
        { (upperCase ? displayName[0].toUpperCase() :
            displayName[0].toLowerCase()) }
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
