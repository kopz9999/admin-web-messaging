import React, { Component } from 'react';
import styles from './TimeLine.css';
import { findDOMNode } from 'react-dom';
// Lib
import Velocity from 'velocity-animate';
require('velocity-animate/velocity.ui');
// App
import FeedButton from './FeedButton';

export default class TimeLine extends Component {
  set childrenDisplayed(value) {
    this._childrenDisplayed = value;
  }

  get childrenDisplayed() {
    return this._childrenDisplayed;
  }

  get childrenNodes() {
    return this._childrenNodes;
  }

  constructor(props) {
    super(props);
    this.childrenDisplayed = false;
    this._childrenNodes = [];
  }

  enqueueNode(node) {
    if (this.childrenDisplayed) {
      return this.animateChildNode(node);
    }
    this._childrenNodes.push(node);
  }

  animateChildNode(node) {
    return Velocity(node, 'transition.slideDownBigIn',
      { duration: 500 });
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
    if (!this.childrenDisplayed && this.props.children &&
      this.props.children.length > 0) {
      this.childrenDisplayed = true;
    }
  }

  renderChildren() {
    return React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        enqueueNode: this.enqueueNode.bind(this),
        animateNode: this.animateChildNode.bind(this),
        elementsDisplayed: this.childrenDisplayed
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
  hasFeedButton: true
};

