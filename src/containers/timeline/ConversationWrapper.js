// App
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Layer
import { LayerProvider } from 'layer-react';
import { Client } from 'layer-sdk';
// App
import Conversation from './Conversation';
import { getLayerConversationId } from '../../utils/Helper';
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
    };
  }

  processConversation() {
    const { currentUser, currentQuery } = this.props;
    const { joinConversation } = this.props.layerClientActions;
    joinConversation(currentUser, currentQuery.conversationId).then(()=> {
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

  componentWillUnmount() {
    const { resetConversationJoin } = this.props.layerClientActions;
    resetConversationJoin();
  }

  renderConversationList() {
    const { currentQuery, currentUser, client } = this.props;

    return (
      <LayerProvider client={client}>
        <Conversation
          currentUser={currentUser}
          currentQuery={currentQuery}
          onMarkMessageRead={this.onMarkMessageRead.bind(this)}
          onSubmitComposerMessage={this.onSubmitComposerMessage.bind(this)}
          onChangeComposerMessage={this.onChangeComposerMessage.bind(this)}
      />
      </LayerProvider>
    );
  }

  onMarkMessageRead(messageId) {
    const { markMessageRead } = this.props.layerClientActions;
    markMessageRead( this.props.client, messageId);
  }

  onChangeComposerMessage(value) {
    const { currentQuery } = this.props;
    const { changeLayerMessage } = this.props.layerClientActions;

    changeLayerMessage(value, this.state.typingPublisher,
      getLayerConversationId(currentQuery.conversationId));
  }

  onSubmitComposerMessage() {
    const { currentUser, currentQuery } = this.props;
    const { submitLayerMessage } = this.props.layerClientActions;

    submitLayerMessage(this.props.client, this.state.typingPublisher,
      currentUser.layerId, currentQuery.layerId,
      getLayerConversationId(currentQuery.conversationId));
  }

  render() {
    const { joiningConversation, joinedConversation, clientReady } = this.props;
    return (!joiningConversation && joinedConversation && clientReady) ?
      this.renderConversationList() : null;
  }
}
