import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import toUUID from '../utils/toUUID';
import Avatar from './Avatar';
import MessageTimestamp from './MessageTimestamp';
import * as Constants from '../utils/constants';
import Helper from '../utils/Helper';

/**
 * This Component provides for a Conversation item
 * in the list, currently consisting of an
 * Avatar, title and Delete button.
 */
export default class ConversationListItem extends Component {
  render() {
    const { conversation, active } = this.props;
    const participantUsers = conversation.participants;
    const displayUserName = participantUsers[0];
    const conversationUrl = `/conversations/${toUUID(conversation.id)}`;
    const currentUserId = window.layerSample.user;
    const styles = cx({
      participant: true,
      'unread-messages': conversation.unreadCount > 0,
      'selected-conversation': active
    });
    let lastTextString = null;
    let displayUserNameString = Helper.trimUserName(displayUserName);
    if (conversation.lastMessage) {
      lastTextString =
          Helper.cutString(conversation.lastMessage.parts[0].body,
              Constants.MAX_TEXT_SIZE, '...')
    }
    return (
      <li className="table-view-cell media conversation-item">
        <Link to={conversationUrl} className={styles}>
          <div className="conversation-header">
            <Avatar users={participantUsers}/>
            <div className="media-body message-title">
              {displayUserNameString}
            </div>
            <MessageTimestamp
                currentUserId={currentUserId}
                displayUserName={displayUserName}
                lastMessage={conversation.lastMessage} />
          </div>
          <div className="media-body message-text">
            {lastTextString}
          </div>
        </Link>
      </li>
    );
  }

}
