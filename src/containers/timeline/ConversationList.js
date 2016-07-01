// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Layer
import { connectQuery } from 'layer-react';
import { QueryBuilder } from 'layer-websdk';
// App
import TimeLine from '../../components/timeline/TimeLine';
import Message from '../../components/timeline/Message';
import toUUID from '../../utils/toUUID';
// Actions
import * as ConversationListActions from '../../actions/conversationListActions';

function mapStateToProps({ layerUsers, conversationList }) {
  return {
    layerUsers,
    ...conversationList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    conversationListActions: bindActionCreators(ConversationListActions, dispatch),
  };
}

function getQueries() {
  return {
    conversations:
      QueryBuilder.conversations().sortBy('lastMessage.sentAt', false)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
@connectQuery({}, getQueries)
export default class ConversationList extends Component {
  /* TODO: Get it from somewhere else */
  getCurrentUserId() {
    return 'Customer Support';
  }
  
  getMessageFromConversation(conversation) {
    let body = null, sentAt = null;
    const { layerUsers } = this.props;
    const { participants, lastMessage } = conversation;
    const layerId =
      participants.filter((e) => e != this.getCurrentUserId())[0];
    const encodedLayerId = encodeURIComponent(layerId);
    if (lastMessage) {
      body = lastMessage.parts[0].body;
      sentAt = lastMessage.sentAt;
    }
    const conversationURL =
      `/users/${encodedLayerId}/conversations/${toUUID(conversation.id)}`;
    const userState = layerUsers[conversation.id][layerId];

    return ({
      key: conversation.id,
      isRead: true,
      conversationURL: conversationURL,
      user: userState.layerUser,
      page: {
        title: '55 Stone Run Rd'
      },
      message: {
        body: body
      },
      receivedAt: sentAt
    });
  }

  verifySetParticipants(props) {
    const { conversations: nextConversations, conversationListActions } = props;
    const { conversations, loadingUsers } = this.props;
    const { loadConversations } = conversationListActions;
    if (nextConversations.length != conversations.length && !loadingUsers) {
      loadConversations(nextConversations);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.verifySetParticipants(nextProps);
  }

  componentWillMount() {
    const { conversationListActions, conversations } = this.props;
    const { loadConversations } = conversationListActions;
    if (conversations.length > 0) {
      loadConversations(conversations);
    }
  }

  renderConversations() {
    const { conversations } = this.props;
    let element = null;
    return conversations.map((c)=> {
      element = this.getMessageFromConversation(c);
      return (
        <Message { ...element} />
      )
    });
  }

  render() {
    const { usersLoaded } = this.props;
    return (
      <TimeLine hasFeedButton={false}>
        { usersLoaded ? this.renderConversations() : null }
      </TimeLine>
    );
  }
}
