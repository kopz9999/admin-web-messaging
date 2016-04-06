import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import toUUID from '../utils/toUUID';
import Avatar from './Avatar';

/**
 * This Component provides for a Conversation item
 * in the list, currently consisting of an
 * Avatar, title and Delete button.
 */
export default class ConversationListItem extends Component {
  handleDeleteConversation = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDeleteConversation(this.props.conversation.id);
  }

  render() {
    const { conversation, users, active, deleteConversation } = this.props;
    const participantUsers = conversation.participants;
    const conversationUrl = `/conversations/${toUUID(conversation.id)}`;

    const styles = cx({
      participant: true,
      'unread-messages': conversation.unreadCount > 0,
      'selected-conversation': active
    });

    const title = conversation.metadata.title || participantUsers.join(', ');
    let lastTextString = conversation.lastMessage.parts[0].body;
    return (
      <li className="table-view-cell media conversation-item">
        <Link to={conversationUrl} className={styles} onClick={this.handleConversationClick} >
          <div className="conversation-header">
            <Avatar users={participantUsers}/>
            <div className="media-body">
              {participantUsers[0]}
            </div>
          </div>
          <div className="media-body message-text">
            {lastTextString}
          </div>
        </Link>
      </li>
    );
  }

  handleConversationClick() {
    var content = document.querySelector('.content');
    var contentView = document.querySelector('.conversation-content-view');
    document.querySelector('.conversation-list-view').style.display = 'none';
    if (contentView !== null) {
      contentView.style.display = 'block';
    }
    // document.querySelector('.conversations').style.display = 'none';
    // document.querySelector('.conversation-content').style.display = 'block';
    content.scrollTop = content.scrollHeight;
  }

}
