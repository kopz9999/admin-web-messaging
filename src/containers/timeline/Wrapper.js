// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// App
import Header from './Header';
import styles from './Wrapper.css';
// Actions
import * as AppActions from '../../actions/appActions';

function mapStateToProps({ app, router }) {
  return {
    ...app,
    currentQuery: {
      layerId: router.params.layerId,
      conversationId: router.params.conversationId,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(AppActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Wrapper extends Component {
  componentDidMount() {
    const { fetchUserInfo } = this.props.appActions;
    fetchUserInfo();
  }

  renderContent() {
    const { currentQuery, currentUser } = this.props;
    return (
      <div className={styles.content}>
        <Header {...currentQuery} />
        <div className={styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            currentQuery,
            currentUser
          })}
        </div>
      </div>
    );
  }

  render() {
    const { userLoaded } = this.props;
    return userLoaded ? this.renderContent() : null;
  }
}
