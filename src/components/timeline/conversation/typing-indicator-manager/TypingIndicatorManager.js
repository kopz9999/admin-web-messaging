// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Layer
import { connectTypingIndicator } from 'layer-react';
// App
import TypingIndicator from './TypingIndicator';

/*
 TODO: Remove !important and get multiple files in TypingIndicatorManager
 */
function mapStateToProps({ layerUsers }) {
  return {
    layerUsers
  };
}

class TypingIndicatorManager extends Component {
  renderTypingIndicators() {
    const { layerUsers, typing, requestScrollDown, conversationId } = this.props;
    let layerUser, key, isVisible, layerConversationUsers;
    layerConversationUsers = layerUsers[conversationId];
    return Object.keys(layerConversationUsers).map((k)=> {
      layerUser = layerConversationUsers[k].layerUser;
      key = layerUser.layerId;
      isVisible = typing.includes(key);
      return (
        <TypingIndicator
          isVisible={isVisible}
          key={key}
          user={layerUser}
          requestScrollDown={requestScrollDown}
        />
      )
    });
  }

  render() {
    return (
      <div>
        { this.renderTypingIndicators() }
      </div>
    );
  };
}

export default connect(mapStateToProps, null)(
  connectTypingIndicator()(TypingIndicatorManager)
);
