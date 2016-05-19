// React
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
import { QueryBuilder } from 'layer-sdk';
import { connectQuery } from 'layer-react';
import * as MessengerActions from '../../actions/messenger';
// App
import TimeLine from '../../components/timeline/TimeLine';
import Message from '../../components/timeline/conversation/Message';
import MessageComposer from '../../components/timeline/conversation/MessageComposer';
import styles from './Conversation.css';

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
export default class Conversation extends Component {
  renderMessageItem(message) {
    const { actions } = this.props;
    const { markMessageRead } = actions;
    const user = { displayName: message.sender.userId, avatarURL: null };

    return (
      <Message
        user={user}
        key={message.id}
        message={message}
        onMarkMessageRead={markMessageRead}
      />
    )
  }

  render() {
    const { actions, composerMessage } = this.props;
    const reversedMessages = this.props.messages.concat().reverse();
    const { changeComposerMessage, submitComposerMessage } = actions;

    return (
      <div className={styles.conversation}>
        <TimeLine hasFeedButton={false} messagesDisplayed={true}>
          {reversedMessages.map(this.renderMessageItem.bind(this))}
        </TimeLine>
        <MessageComposer
          value={composerMessage}
          onChange={changeComposerMessage}
          onSubmit={submitComposerMessage}/>
      </div>
    );
  }
}
