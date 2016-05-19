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
    this._messagesDisplayed = props.messagesDisplayed;
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

  renderFeedButton() {
    return (
      <FeedButton  />
    );
  }

  render() {
    const { hasFeedButton } = this.props;
    const feedButton = hasFeedButton ? this.renderFeedButton() : null;

    return (
      <section className={styles.timeLine}>
        { feedButton }
        <div className={styles.container}>
          { this.renderChildren() }
        </div>
      </section>
    );
  }
}

TimeLine.propTypes = {
  hasFeedButton: React.PropTypes.bool
};

TimeLine.defaultProps = {
  messagesDisplayed: false,
  hasFeedButton: true
};

