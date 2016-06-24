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
@connectTypingIndicator()
export default class TypingIndicatorManager extends Component {
  renderTypingIndicators() {
    const { layerUsers, typing, requestScrollDown } = this.props;
    let layerUser, key, isVisible;
    return Object.keys(layerUsers).map((k)=> {
      layerUser = layerUsers[k].layerUser;
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
