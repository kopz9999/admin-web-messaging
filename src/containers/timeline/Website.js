// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// App
import TimeLine from '../../components/timeline/TimeLine';
import Visit from '../../components/timeline/Visit';
import Message from '../../components/timeline/Message';
import toUUID from '../../utils/toUUID';
// Actions
import * as ConversationActions from '../../actions/conversationActions';

function mapStateToProps({ users }) {
  return {
    users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    conversationActions: bindActionCreators(ConversationActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Website extends Component {
  renderVisits() {
    let visits = Website.getVisitData();
    return visits.map((element, index)=> {
      return (
        <Visit
          {
            ...({
              ...element,
              key: index
            })
          }
        />
      )
    });
  }

  renderMessages() {
    let messages = Website.getMessageData();
    return messages.map((element, index)=> {
      return (
        <Message
          {
            ...({
              ...element,
              key: index
            })
          }
        />
      )
    });
  }

  /* TODO: Get it from somewhere else */
  getCurrentUserId() {
    return 'Customer Support';
  }

  getMessageFromConversation(conversation) {
    let body = null, sentAt = null;
    const { users } = this.props;
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
    const userState = users[layerId];
    if (userState && userState.user) {
      return ({
        key: conversation.id,
        isRead: true,
        conversationURL: conversationURL,
        user: userState.user,
        page: {
          title: '55 Stone Run Rd'
        },
        message: {
          body: body
        },
        receivedAt: sentAt
      });
    } else {
      return null;
    }
  }

  verifySetParticipants(props) {
    const { conversations: nextConversations } = props;
    const { conversations } = this.props;
    if (nextConversations.length != conversations.length) {
      this.setParticipants(props);
    }
  }

  setParticipants(props) {
    const { conversationActions } = props;
    const { conversations } = props;
    const { loadParticipants } = conversationActions;
    
    conversations.forEach((conversation) => {
      loadParticipants(conversation);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.verifySetParticipants(nextProps);
  }

  renderConversations() {
    const { conversations } = this.props;
    const messages = [];
    let messageObject = null;
    conversations.forEach( (c)=> {
      messageObject = this.getMessageFromConversation(c);
      if (messageObject) messages.push(messageObject);
    });
    return messages.map((element)=> {
      return (
        <Message { ...element} />
      )
    });
  }

  render() {
    return (
      <TimeLine hasFeedButton={false}>
        { this.renderConversations() }
      </TimeLine>
    );
  }
}
