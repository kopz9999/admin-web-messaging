import React, { Component } from 'react';
import styles from './MessageComposer.css';

const ENTER = 13;

export default class MessageComposer extends Component {

  /**
   * Any time the input changes, we'll want to send a typing indicator
   * to other participants; this.props.onChange handles that.
   */
  handleChange = (event) => {
    this.props.onChange(event.target.value);
  }

  /**
   * onEnter, send the message using this.props.onSubmit()
   */
  handleKeyDown = (event) => {
    if (event.keyCode === ENTER && !event.shiftKey) {
      event.preventDefault();
      this.verifySendMessage();
    }
  };

  verifySendMessage() {
    if (this.props.value.length) {
      this.props.onSubmit();
    }
  }



  render() {
    return (
      <div className={styles.messageComposer}>
        <textarea
          onClick={this.props.onFocus}
          onBlur={this.props.onBlur}
          autoFocus={true}
          className={styles.textArea}
          placeholder='Enter a message...'
          rows='1'
          value={this.props.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}/>
        <img onClick={this.verifySendMessage.bind(this)}
             className={styles.submitButton}
             src={'./assets/button.png'} />
      </div>
    );
  }
}
