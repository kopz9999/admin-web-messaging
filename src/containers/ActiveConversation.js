import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
import { QueryBuilder } from 'layer-sdk';
import { connectQuery } from 'layer-react';
import * as MessengerActions from '../actions/messenger';
import ConversationHeader from '../components/ConversationHeader';
import MessageList from '../components/MessageList';
import MessageComposer from '../components/MessageComposer';
import TypingIndicatorContainer from './TypingIndicatorContainer';
import { Link } from 'react-router';

function mapStateToProps({ activeConversation, router }) {
  return {
    ...activeConversation,
    activeConversationId: `layer:///conversations/${router.params.conversationId}`
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(MessengerActions, dispatch) };
}

function getQueries({ activeConversationId, messagePagination }) {
  return {
    messages: QueryBuilder
      .messages()
      .forConversation(activeConversationId)
      .paginationWindow(messagePagination)
  };
}

@connectRedux(mapStateToProps, mapDispatchToProps)
@connectQuery({}, getQueries)
export default class ActiveConversation extends Component {

  render() {
    const {
      editingTitle,
      title,
      composerMessage,
      activeConversationId,
      conversations,
      messages,
      users,
      actions
    } = this.props;
    const {
      editConversationTitle,
      changeConversationTitle,
      saveConversationTitle,
      cancelEditConversationTitle,
      loadMoreMessages,
      changeComposerMessage,
      submitComposerMessage,
      markMessageRead
    } = actions;

    const activeConversation = conversations.find((conversation) => {
      return conversation.id === activeConversationId;
    });

    var currTitle;
    if (activeConversation) {
      currTitle = activeConversation.participants[0];
    }
    // Render the ConversationHeader, MessageList,
    // TypingIndicatorContainer and MessageComposer
    return (
      <div className="conversation-content-view">
        <header className="bar bar-nav">
          <Link to={'/'} className='icon icon-left-nav pull-left'>
          </Link>
          <h1 className="title">{currTitle}</h1>
        </header>
        <div className="content">
          <MessageList
              messages={messages}
              users={users}
              onMarkMessageRead={markMessageRead}
              onLoadMoreMessages={loadMoreMessages}/>

          <TypingIndicatorContainer
              users={users}
              conversationId={activeConversationId}/>

          <MessageComposer
              value={composerMessage}
              onChange={changeComposerMessage}
              onSubmit={submitComposerMessage}/>
        </div>
      </div>
    );
  }
}
