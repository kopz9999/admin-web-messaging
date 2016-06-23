// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// App
import Header from './Header';
import styles from './Wrapper.css';
// Actions
import * as AppActions from '../../actions/appActions';
import * as TimeLineActions from '../../actions/timeLineActions';

function mapStateToProps({ timeLine, app, algolia, router }) {
  return {
    ...app,
    timeLine,
    algolia,
    currentQuery: {
      siteId: router.params.siteId,
      pageId: router.params.pageId,
      layerId: router.params.layerId,
      conversationId: router.params.conversationId,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(AppActions, dispatch),
    timeLineActions: bindActionCreators(TimeLineActions, dispatch),
  };
}

/* TODO: Move indexes to actions. Avoid pass them down trough props */
@connect(mapStateToProps, mapDispatchToProps)
export default class Wrapper extends Component {
  componentWillMount() {
    const { token } = this.props;
    const { fetchUserInfo } = this.props.appActions;
    fetchUserInfo(token);
  }

  renderContent() {
    const { currentQuery, currentUser, timeLineActions,
      timeLine, algolia } = this.props;
    return (
      <div className={styles.content}>
        <Header
          {...currentQuery}
          {...algolia}
          timeLine={timeLine}
          timeLineActions={timeLineActions}
        />
        <div className={styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            ...timeLine,
            ...timeLineActions,
            ...algolia,
            currentQuery,
            currentUser,
          })}
        </div>
      </div>
    );
  }

  render() {
    const { userLoaded, algolia } = this.props;
    return userLoaded && algolia.ready ? this.renderContent() : null;
  }
}
