import Helper from '../utils/Helper'
import React, { Component } from 'react';

export default class MessageTimestamp extends Component {
  renderReadNode() {
    const currentUserId = this.props.currentUserId;
    const lastMessage = this.props.lastMessage;
    const displayInitials = Helper.initialsFromFullName(this.props.displayUserName);
    const customStyle = {
      backgroundColor: Helper.generatePastelColors(displayInitials),
    };
    if (lastMessage.sender.userId != currentUserId) {
      if (lastMessage.recipientStatus[currentUserId] != 'read') {
        return (<div className="unread" style={customStyle}></div>)
      }
    }
    return null;
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({});
    }, 60000);
  }

  render() {
    const lastMessage = this.props.lastMessage;
    let readNode = null;
    let lastTextSinceString = null;

    if (lastMessage) {
      lastTextSinceString = Helper.timeSinceCompose(lastMessage.sentAt);
      readNode = this.renderReadNode();
    }
    return (
      <div className="media-body message-since">
        {readNode}
        <span> {lastTextSinceString} </span>
      </div>
    );
}
}