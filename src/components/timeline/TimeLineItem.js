import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

export default class TimeLineItem extends Component {
  get inlineStyles() {
    const display = this.state.isVisible ? 'block' : 'none';
    return { display: display };
  }

  constructor(props) {
    super(props);
    this.state = {
      isEntering: false,
      isVisible: true
    };
  }

  onComponentDisplayed(){
    const domNode = findDOMNode(this);
    domNode.parentNode.style.height = null;
    this.setState({ isEntering: false, isVisible: true });
  }

  componentDidMount() {
    let domNode = null, height = null;
    if (!this.state.isVisible) {
      domNode = findDOMNode(this);
      domNode.style.visibility = 'hidden';
      domNode.style.display = 'block';
      height = domNode.offsetHeight;
      this.setState({ isEntering: true, height: height });
      domNode.style.display = 'none';
      domNode.style.visibility = 'visible';
      domNode.parentNode.style.height =
        `${domNode.parentNode.offsetHeight + height}px`;
      this.props.animateNode(domNode)
        .then(this.onComponentDisplayed.bind(this));
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    return !this.state.isEntering;
  }

  componentWillMount() {
    const { elementsDisplayed } = this.props;
    if (elementsDisplayed) {
      this.setState({ isVisible: false });
    }
  }
}
