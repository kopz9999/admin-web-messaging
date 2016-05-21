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
    this.setState({ isEntering: false, isVisible: true });
  }

  componentDidMount() {
    const { elementsDisplayed } = this.props;
    let domNode = null;
    if (elementsDisplayed) {
      domNode = findDOMNode(this);
      this.setState({ isEntering: true });
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
