import React, { Component } from 'react';
import styles from './TextMessagePart.css';
import Linkify from 'react-linkify';

/*
* TODO: Common package. Find better solution and reuse
* */
export default class TextMessagePart extends Component {
  constructor(props) {
    super(props);
    const styleParams = props.styles || {};
    this.state = {
      styles: { ...styles, ...styleParams },
    };
  }

  renderLine(textLine, index) {
    return (
      <div key={index} className={this.state.styles.textLine}>
        <Linkify properties={{target: '_blank', className: this.state.styles.link}}> { textLine } </Linkify>
      </div>
    );
  }

  render() {
    const { text } = this.props;
    const textLines = text.split('\n');
    return (
      <div className={this.state.styles.textPart}>
        { textLines.map((t, i)=> this.renderLine(t, i)) }
      </div>
    );
  }
}