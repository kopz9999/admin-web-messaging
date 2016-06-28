// App
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Layer
import { LayerProvider } from 'layer-react';
import { Client } from 'layer-sdk';
// App
import Conversation from './Conversation';
// Actions
import * as LayerClientActions from '../../actions/layerClientActions';
import * as ConversationActions from '../../actions/conversationActions';

function mapStateToProps({ layerClient, settings }) {
  return {
    ...layerClient,
    settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    layerClientActions: bindActionCreators(LayerClientActions, dispatch),
    conversationActions: bindActionCreators(ConversationActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ConversationWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typingPublisher: null,
      conversationId: null,
    };
  }

  processConversation() {
    const { currentUser, currentQuery } = this.props;
    const { joinConversation } = this.props.layerClientActions;
    joinConversation(currentQuery.layerId).then(()=> {
      this.state.typingPublisher = this.props.client.createTypingPublisher();
    });
  }

  verifyProcessConversation() {
    const { joiningConversation, joinedConversation, clientReady } = this.props;
    if (!joiningConversation && !joinedConversation && clientReady) {
      this.processConversation();
    }
  }

  componentDidMount() {
    this.verifyProcessConversation();
  }

  componentDidUpdate() {
    this.verifyProcessConversation();
  }

  componentWillMount() {
    this.props.liveFetchEvents(100);
  }

  componentWillUnmount() {
    const { resetConversationJoin } = this.props.layerClientActions;
    resetConversationJoin();
    this.props.doClearEventsTimeout();
  }

  renderConversationList() {
    const { currentQuery, currentUser, client, events } = this.props;

    return (
      <LayerProvider client={client}>
        <Conversation
          events={events}
          currentUser={currentUser}
          currentQuery={currentQuery}
          transferScopeData={this.receiveConversationData.bind(this)}
          onMarkMessageRead={this.onMarkMessageRead.bind(this)}
          onSubmitComposerMessage={this.onSubmitComposerMessage.bind(this)}
          onChangeComposerMessage={this.onChangeComposerMessage.bind(this)}
      />
      </LayerProvider>
    );
  }

  receiveConversationData({ conversationId }) {
    this.state.conversationId = conversationId;
  }

  onMarkMessageRead(messageId) {
    const { markMessageRead } = this.props.layerClientActions;
    markMessageRead( this.props.client, messageId);
  }

  onChangeComposerMessage(value) {
    const { changeLayerMessage } = this.props.layerClientActions;

    changeLayerMessage(value, this.state.typingPublisher,
      this.state.conversationId);
  }

  onSubmitComposerMessage() {
    const { currentUser, currentQuery } = this.props;
    const { submitLayerMessage } = this.props.layerClientActions;

    submitLayerMessage(this.props.client, this.state.typingPublisher,
      currentUser.layerId, currentQuery.layerId, this.state.conversationId);
  }

  render() {
    const { joiningConversation, joinedConversation, clientReady } = this.props;
    return (!joiningConversation && joinedConversation && clientReady) ?
      this.renderConversationList() : null;
  }
}
