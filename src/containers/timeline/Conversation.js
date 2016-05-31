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
import styles from './Conversation.css';
import throttledEventListener from '../../utils/throttledEventListener';
import { getLayerConversationId } from '../../utils/Helper';
// Actions
import * as MessengerActions from '../../actions/messenger';
import * as ConversationActions from '../../actions/conversationActions';

function mapStateToProps({ app, activeConversation, users }) {
  return {
    app,
    users,
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
      stickBottom: true
    };
  }

  get scrollNode() {
    return document.body;
  }

  addDocumentListeners() {
    this.removeScrollListener = throttledEventListener(window, 'scroll',
      this.handleScroll, this);
    this.removeResizeListener = throttledEventListener(window, 'resize',
      this.handleScroll, this);
    this.scrollBottom();
  }

  verifyConversationLoad() {
    const { app, loadingConversation, conversationLoaded } = this.props;
    const { clientReady } = app;
    if (clientReady && !loadingConversation && !conversationLoaded) {
      this.loadConversation();
    }
  }

  loadConversation() {
    const { conversationActions, currentQuery } = this.props;
    const { requestConversation } = conversationActions;
    requestConversation(getLayerConversationId(currentQuery.conversationId));
  }

  componentDidMount() {
    this.addDocumentListeners();
    this.verifyConversationLoad();
  }

  componentDidUpdate() {
    if (this.state.stickBottom) {
      this.scrollBottom();
    }
    this.verifyConversationLoad();
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
    const { actions, users } = this.props;
    const { markMessageRead } = actions;
    const user = users[message.sender.userId].user;

    return (
      <Message
        user={user}
        key={message.id}
        message={message}
        onMarkMessageRead={markMessageRead}
      />
    )
  }

  renderMessages() {
    const { loadedUsers, conversationLoaded } = this.props;
    let reversedMessages = null;
    if (loadedUsers && conversationLoaded) {
      reversedMessages = this.props.messages.filter((m)=> m.isSaved).reverse();
      return reversedMessages.map(this.renderMessageItem.bind(this));
    } else {
      return null;
    }
  }

  render() {
    const { actions, composerMessage } = this.props;
    const { changeComposerMessage, submitComposerMessage } = actions;

    return (
      <div className={styles.conversation}>
        <TimeLine hasFeedButton={false}>
          { this.renderMessages() }
        </TimeLine>
        <MessageComposer
          value={composerMessage}
          onChange={changeComposerMessage}
          onSubmit={submitComposerMessage}/>
      </div>
    );
  }
}
