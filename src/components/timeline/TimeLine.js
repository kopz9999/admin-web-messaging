import React, { Component } from 'react';
import styles from './TimeLine.css';
import { findDOMNode } from 'react-dom';
// Lib
import Velocity from 'velocity-animate';
require('velocity-animate/velocity.ui');
// App
import FeedButton from './FeedButton';

export default class TimeLine extends Component {
  set messagesDisplayed(value) {
    this._messagesDisplayed = value;
  }

  get messagesDisplayed() {
    return this._messagesDisplayed;
  }

  get childrenNodes() {
    return this._childrenNodes;
  }

  constructor(props) {
    super(props);
    this._messagesDisplayed = false;
    this._childrenNodes = [];
  }

  renderNode(node) {
    if (this.messagesDisplayed) {
      this.animateChildNode(node);
    }
    this._childrenNodes.push(node);
  }

  animateChildNode(node) {
    return Velocity(node, 'transition.slideDownBigIn',
      { delay: 500, duration: 500 });
  }

  displayTimeLineItems() {
    const lastPosition = this.childrenNodes.length - 1;
    let promise = this.animateChildNode(this.childrenNodes[lastPosition]);

    for (let i=lastPosition - 1; i >= 0; --i) {
      promise = promise.then(()=> {
        return this.animateChildNode(this.childrenNodes[i]);
      });
    }
  }

  componentDidUpdate() {
    if (!this.messagesDisplayed && this.props.children && this.props.children.length > 0) {
      this.displayTimeLineItems();
      this.messagesDisplayed = true;
    }
  }

  renderChildren() {
    return React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        onRenderNode: this.renderNode.bind(this)
      })
    );
  }

  render() {
    return (
      <section className={styles.timeLine}>
        <FeedButton  />
        <div className={styles.container}>
          { this.renderChildren() }
        </div>
      </section>
    );
  }
}
