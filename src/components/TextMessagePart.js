import React, { Component } from 'react';

export default class TextMessagePart extends Component {
  render() {
    return (
      <div className='bubble text'>
        <p>
          <span className="user-name">{this.props.user}:</span>
          <br/>
          {this.props.messagePart.body}
        </p>
      </div>
    );
  }
}
