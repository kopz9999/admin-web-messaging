// React
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
// Lib
import { QueryBuilder } from 'layer-sdk';
import { connectQuery } from 'layer-react';
// App
import * as MessengerActions from '../../actions/messenger';
import TimeLine from '../../components/timeline/TimeLine';
import Message from '../../components/timeline/conversation/Message';
import MessageComposer from '../../components/timeline/conversation/MessageComposer';
import styles from './Conversation.css';
import throttledEventListener from '../../utils/throttledEventListener';

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
  constructor(props) {
    super(props);

    this.state = {
      stickBottom: true
    };
  }

  get scrollNode() {
    return document.body;
  }

  componentDidMount() {
    // this.removeScrollListener = throttledEventListener(this.scrollNode, 'scroll', this.handleScroll, this);
    this.removeScrollListener = throttledEventListener(window, 'scroll', this.handleScroll, this);
    this.removeResizeListener = throttledEventListener(window, 'resize', this.handleScroll, this);
    this.scrollBottom();
  }

  componentDidUpdate() {
    if (this.state.stickBottom) {
      this.scrollBottom();
    }
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
    const reversedMessages =
      this.props.messages.filter((m)=> m.isSaved).reverse();
    const { changeComposerMessage, submitComposerMessage } = actions;

    return (
      <div className={styles.conversation}>
        <TimeLine hasFeedButton={false}>
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
