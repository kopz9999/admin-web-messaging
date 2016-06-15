// React
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
// Lib
import { QueryBuilder } from 'layer-sdk';
import { connectQuery } from 'layer-react';
// App
import TimeLine from '../../components/timeline/TimeLine';
import Message from '../../components/timeline/conversation/Message';
import MessageComposer from '../../components/timeline/conversation/MessageComposer';
import TypingIndicatorManager from '../../components/timeline/conversation/typing-indicator-manager/TypingIndicatorManager';
import styles from './Conversation.css';
import throttledEventListener from '../../utils/throttledEventListener';
import { getLayerConversationId } from '../../utils/Helper';
// Actions
import * as MessengerActions from '../../actions/messenger';
import * as ConversationActions from '../../actions/conversationActions';

function mapStateToProps({ app, activeConversation, layerUsers }) {
  return {
    app,
    layerUsers,
    ...activeConversation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(MessengerActions, dispatch),
    conversationActions: bindActionCreators(ConversationActions, dispatch),
  };
}

function getQueries({ messagePagination, currentQuery }) {
  return {
    messages: QueryBuilder
      .messages()
      .forConversation(getLayerConversationId(currentQuery.conversationId))
      .paginationWindow(messagePagination)
  };
}

@connectRedux(mapStateToProps, mapDispatchToProps)
@connectQuery({}, getQueries)
export default class Conversation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stickBottom: true,
      showingKeyboard: false,
    };
  }

  get scrollNode() {
    return findDOMNode(this);
  }

  addDocumentListeners() {
    this.removeScrollListener = throttledEventListener(window, 'scroll',
      this.handleScroll, this);
    this.removeResizeListener = throttledEventListener(window, 'resize',
      this.handleScroll, this);
    this.scrollBottom();
  }

  componentDidMount() {
    this.addDocumentListeners();
  }

  requestScrollDown() {
    if (this.state.stickBottom) {
      this.scrollBottom();
    }
  }

  componentDidUpdate() {
    this.requestScrollDown();
  }

  scrollBottom() {
    if (!this.state.isScrolling) {
      var el = this.scrollNode;
      el.scrollTop = el.scrollHeight;
    }
  }

  handleScroll() {
    const el = this.scrollNode;
    const { actions } = this.props;
    const { loadMoreMessages } = actions;

    if (el.scrollTop === 0) {
      loadMoreMessages();
    }

    const stickBottom = el.scrollHeight - 1 <= el.clientHeight + el.scrollTop;

    if (stickBottom !== this.state.stickBottom) {
      this.setState({ stickBottom });
    }

  }

  componentWillUnmount() {
    this.removeResizeListener();
    this.removeScrollListener();
  }

  renderMessageItem(message) {
    const { layerUsers, currentQuery, onMarkMessageRead,
      currentUser } = this.props;
    const conversationUsers =
      layerUsers[getLayerConversationId(currentQuery.conversationId)];
    const user = conversationUsers[message.sender.userId].layerUser;
    const consumerUser = conversationUsers[currentQuery.layerId].layerUser;

    return (
      <Message
        consumerUser={consumerUser}
        currentUser={currentUser}
        user={user}
        key={message.id}
        message={message}
        onMarkMessageRead={onMarkMessageRead}
      />
    )
  }

  usersReady() {
    const { loadedUsers, conversationLoaded } = this.props;
    return loadedUsers && conversationLoaded;
  }

  renderMessages() {
    let reversedMessages = null;
    if (this.usersReady()) {
      reversedMessages = this.props.messages.filter((m)=> m.isSaved).reverse();
      return reversedMessages.map(this.renderMessageItem.bind(this));
    } else {
      return null;
    }
  }

  renderTypingIndicatorManager() {
    const { conversationId } = this.props.currentQuery;
    if (this.usersReady()) {
      return (
        <TypingIndicatorManager
          conversationId={getLayerConversationId(conversationId)}
          requestScrollDown={this.requestScrollDown.bind(this)}
        />
      );
    } else {
      return null;
    }
  }

  onFocus() {
    console.log('focused..');
    this.state.showingKeyboard = true;
  }

  onBlur() {
    console.log('blurred..');
    this.state.showingKeyboard = false;
  }

  render() {
    const { composerMessage, onSubmitComposerMessage,
      onChangeComposerMessage } = this.props;
    const contentStyle = this.state.showingKeyboard ?
      styles.contentWrapper : '';

    return (
      <div className={styles.conversation}>
        <div className={contentStyle}>
          <TimeLine hasFeedButton={false}>
            { this.renderMessages() }
          </TimeLine>
          { this.renderTypingIndicatorManager() }
        </div>
        <MessageComposer
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          value={composerMessage}
          onChange={onChangeComposerMessage}
          onSubmit={onSubmitComposerMessage}/>
      </div>
    );
  }
}
