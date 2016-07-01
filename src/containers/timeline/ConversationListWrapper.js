// App
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Layer
import { LayerProvider } from 'layer-react';
import { Client } from 'layer-websdk';
// App
import ConversationList from './ConversationList';
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
export default class ConversationListWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null
    };
  }

  componentDidMount() {
    const { appId, defaultLayerId } = this.props.settings;
    const { fetchUserLayerClient } = this.props.layerClientActions
    this.state.client = new Client({appId: appId });
    fetchUserLayerClient(this.state.client, defaultLayerId);
  }

  componentWillUnmount() {
    const { clientReset } = this.props.layerClientActions;
    clientReset();
  }

  renderConversationList() {
    const { client } = this.state;
    return (
      <LayerProvider client={client}>
        <ConversationList />
      </LayerProvider>
    );
  }

  render() {
    const { clientReady } = this.props;
    return clientReady ? this.renderConversationList() : null;
  }
}