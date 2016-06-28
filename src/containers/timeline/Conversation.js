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
import Visit from '../../components/timeline/conversation/Visit';
import MessageComposer from '../../components/timeline/conversation/MessageComposer';
import TypingIndicatorManager from '../../components/timeline/conversation/typing-indicator-manager/TypingIndicatorManager';
import styles from './Conversation.css';
import throttledEventListener from '../../utils/throttledEventListener';
import { getLayerConversationId } from '../../utils/Helper';
// Actions
import * as MessengerActions from '../../actions/messenger';
import * as ConversationActions from '../../actions/conversationActions';
// Constants
import { MESSAGE, VISIT } from '../../constants/EventTypes';

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

function getQueries({ messagePagination, conversationId }) {
  return {
    messages: QueryBuilder
      .messages()
      .forConversation(conversationId)
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
      timeoutId: null,
    };
  }

  get scrollNode() {
    return document.body;
  }

  doTransferScopeData(props) {
    const { transferScopeData, conversationId } = props;
    transferScopeData({ conversationId });
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

  componentWillMount() {
    this.doTransferScopeData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.conversationId != nextProps.conversationId) {
      this.doTransferScopeData(nextProps);
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
    const { layerUsers, currentQuery, onMarkMessageRead,
      currentUser } = this.props;
    const user = layerUsers[message.sender.userId].layerUser;
    const consumerUser = layerUsers[currentQuery.layerId].layerUser;

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

  renderTypingIndicatorManager() {
    const { conversationId, layerUsers } = this.props;
    return (
      <TypingIndicatorManager
        conversationId={conversationId}
        layerUsers={layerUsers}
        requestScrollDown={this.requestScrollDown.bind(this)}
      />
    );
  }

  onFocus() {
    this.state.showingKeyboard = true;
  }

  onBlur() {
    this.state.showingKeyboard = false;
  }

  renderEventsFeed() {
    const { events } = this.props;
    let eventComponents = [];
    events.forEach((event)=> {
      switch (event.type) {
        case MESSAGE:
          if (event.layerMessage) {
            eventComponents.unshift(this.renderMessageItem(event.layerMessage));
          }
          break;
        case VISIT:
          eventComponents.unshift(<Visit { ...event } />);
          break;
      }
    });
    return eventComponents;
  }

  renderConversationData() {
    const contentStyle = this.state.showingKeyboard ?
      styles.contentWrapper : '';

    if (this.usersReady()) {
      return (
        <div className={contentStyle}>
          <TimeLine hasFeedButton={false}>
            { this.renderEventsFeed() }
          </TimeLine>
          { this.renderTypingIndicatorManager() }
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const { composerMessage, onSubmitComposerMessage,
      onChangeComposerMessage } = this.props;

    return (
      <div className={styles.conversation}>
        { this.renderConversationData() }
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
