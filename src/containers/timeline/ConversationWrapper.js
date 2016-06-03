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

function mapStateToProps({ layerClient, settings }) {
  return {
    ...layerClient,
    settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    layerClientActions: bindActionCreators(LayerClientActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ConversationWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      typingPublisher: null,
    };
  }

  componentDidMount() {
    let client = null;
    const { appId } = this.props.settings;
    const { currentUser, currentQuery } = this.props;
    const { processConversationForUser, fetchUserLayerClient } =
      this.props.layerClientActions;
    processConversationForUser(currentUser,
      getLayerConversationId(currentQuery.conversationId)
    ).then(()=> {
      client = new Client({appId: appId });
      this.state.typingPublisher = client.createTypingPublisher();
      fetchUserLayerClient(client, currentUser.id.toString());
      this.state.client = client;
    });
  }

  componentWillUnmount() {
    const { clientReset } = this.props.layerClientActions;
    clientReset();
  }

  renderConversationList() {
    const { client } = this.state;
    const { currentQuery } = this.props;

    return (
      <LayerProvider client={client}>
        <Conversation
          currentQuery={currentQuery}
          onSubmitComposerMessage={this.onSubmitComposerMessage.bind(this)}
          onChangeComposerMessage={this.onChangeComposerMessage.bind(this)}
      />
      </LayerProvider>
    );
  }

  onChangeComposerMessage(value) {
    const { currentQuery } = this.props;
    const { changeLayerMessage } = this.props.layerClientActions;

    changeLayerMessage(value, this.state.typingPublisher,
      getLayerConversationId(currentQuery.conversationId));
  }

  onSubmitComposerMessage() {
    const { currentQuery } = this.props;
    const { submitLayerMessage } = this.props.layerClientActions;

    submitLayerMessage(this.state.client, this.state.typingPublisher,
      getLayerConversationId(currentQuery.conversationId));
  }

  render() {
    const { clientReady } = this.props;
    return clientReady ? this.renderConversationList() : null;
  }
}
