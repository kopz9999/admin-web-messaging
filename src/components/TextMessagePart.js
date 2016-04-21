import React, { Component } from 'react';
import Helper from '../utils/Helper';

export default class TextMessagePart extends Component {
  render() {
    return (
      <div className='bubble text'>
        <p>
          <span className="user-name">{Helper.trimUserName(this.props.user)}:</span>
          <br/>
          {this.props.messagePart.body}
        </p>
      </div>
    );
  }
}
