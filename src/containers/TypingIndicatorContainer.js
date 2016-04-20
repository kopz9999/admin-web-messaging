import React, { Component, PropTypes } from 'react';
import { connectTypingIndicator } from 'layer-react';
import cx from 'classnames';

/**
 * This Component renders a list of names of people
 * who are currently typing in the Conversation.
 */
@connectTypingIndicator()
export default class TypingIndicator extends Component {
  doScroll() {
    let display = this.props.typing.length >= 1;
    if (display) {
      this.props.onChange();
    }
  }
  componentDidUpdate() {
    this.doScroll();
  }
  componentDidMount() {
    this.doScroll();
  }
  render() {
    let display = this.props.typing.length >= 1;
    let classes = cx({
      'message-item': true,
      'typing': true,
      'hide': !display,
    });
    return (
        <div className={classes}>
          <img className="conversation-avatar" src="./assets/user-avatar-small.png"/>
          <div className="main">
            <div className="message-parts">
              <div className="bubble text">
                <p className="blink-animation"> &bull;&bull;&bull; </p>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
