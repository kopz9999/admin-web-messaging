import React, { Component, PropTypes } from 'react';
import TextMessagePart from './TextMessagePart';
import ConversationAvatar from './ConversationAvatar';
import Helper from '../utils/Helper';
import cx from 'classnames';

/**
 * This Component renders a single Message in a Message List
 * which includes Avatar, sender name, message body,
 * timestamp and status.
 */
export default class MessageListItem extends Component {
  /**
   * At this time we are marking any Message that has been
   * rendered as read.  A more advanced implementation
   * would test if was scrolled into view.
   */
  componentDidMount() {
    this.markMessageRead();
  }

  componentWillReceiveProps() {
    this.markMessageRead();
  }

  markMessageRead() {
    const { onMarkMessageRead, message } = this.props;
    if (message.isUnread) {
      onMarkMessageRead(message.id);
    }
  }

  getMessageStatus(message) {
    return message.readStatus == 'ALL' ? 'Read' : '';
  }

  render() {
    const { message, users } = this.props;
    const user = message.sender.userId;
    const messageStatus = this.getMessageStatus(message);
    let isCurrentUserMessage = user === window.layerSample.user;
    let currentUserAvatarURL = './assets/admin-avatar-small.png';
    let defaultUserAvatarURL = './assets/user-avatar-small.png';
    let leftAvatar = !isCurrentUserMessage ?
      (<ConversationAvatar avatarURL={defaultUserAvatarURL}/>) : null;
    let rightAvatar = isCurrentUserMessage ?
      (<ConversationAvatar avatarURL={currentUserAvatarURL}/>) : null;
    let classes = cx({
      'message-item': true,
      'current-user-message': isCurrentUserMessage
    });
    let displayUser = isCurrentUserMessage ? 'You' : user;

    return (
      <div className={classes}>
        {leftAvatar}
        <div className='main'>
          <div className='message-parts'>
            {message.parts.map((messagePart) => {
              return (
                <TextMessagePart
                  key={messagePart.id}
                  user={displayUser}
                  messagePart={messagePart}/>
              )
            })}
          </div>
        </div>
        {rightAvatar}
        <div className='data'>
          <div className='message-date'>{Helper.formatTimestamp(message.sentAt)}</div>
          <div className='message-status'>{messageStatus}</div>
          <div className="clear"></div>
        </div>
      </div>
    );
  }
}
