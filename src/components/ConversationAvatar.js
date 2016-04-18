import React, { Component, PropTypes } from 'react';

export default class ConversationAvatar extends Component {

  static propTypes = {
    avatarURL: PropTypes.string
  };

  render() {
    return (
      <img className="conversation-avatar" src={this.props.avatarURL} />
    );
  }
}
