// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Actions
import * as AppActions from '../actions/appActions';

function mapStateToProps({ app }) {
  return {
    ...app,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(AppActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Logout extends Component {
  componentDidMount() {
    const { logout } = this.props.appActions;
    logout();
  }

  render() {
    return (
      <div></div>
    );
  }
}
