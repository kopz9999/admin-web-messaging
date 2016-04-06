import React, { Component, PropTypes } from 'react';
import ConversationListItem from './ConversationListItem';

export default class ConversationList extends Component {

  /**
   * Function for rendering a Conversation in the Conversation List.
   */
  renderConversationListItem = (conversation) => {
    const {
      users,
      activeConversationId,
      onDeleteConversation
    } = this.props;

    return (
      <ConversationListItem
        key={conversation.id}
        conversation={conversation}
        users={users}
        active={activeConversationId === conversation.id}
        onDeleteConversation={onDeleteConversation} />
    );
  }

  /**
   * Render every Conversation in this.props.conversations
   * in the Conversation List.
   */
  render() {
    const { conversations } = this.props;

    return (
      <div className="conversation-list-view">
        <header className="bar bar-nav">
          <h1 className="title">Curaytor</h1>
        </header>
        <div className="content">
          <div className='navigation-container'>
            <ul className="table-view conversations">
              {conversations.map(this.renderConversationListItem)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
