// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Libs
import algoliasearch from 'algoliasearch';
// App
import Header from './Header';
import styles from './Wrapper.css';
// Actions
import * as AppActions from '../../actions/appActions';
import * as TimeLineActions from '../../actions/timeLineActions';

function mapStateToProps({ timeLine, app, router }) {
  return {
    ...app,
    timeLine,
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

@connect(mapStateToProps, mapDispatchToProps)
export default class Wrapper extends Component {
  constructor(props) {
    super(props);
    const algoliaClient = algoliasearch('V0L0EPPR59',
      '363cd668faa7d392287982a6cb352d26');
    const eventsIndex = algoliaClient.initIndex('events_log');
    const pagesIndex = algoliaClient.initIndex('pages');
    this.state = {
      eventsIndex,
      pagesIndex
    };
  }

  componentWillMount() {
    const { token } = this.props;
    const { fetchUserInfo } = this.props.appActions;
    fetchUserInfo(token);
  }

  renderContent() {
    const { currentQuery, currentUser, timeLineActions, timeLine } = this.props;
    return (
      <div className={styles.content}>
        <Header {...currentQuery}
          timeLine={timeLine}
          timeLineActions={timeLineActions}
          eventsIndex={this.state.eventsIndex}
          pagesIndex={this.state.pagesIndex}
        />
        <div className={styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            ...timeLine,
            ...timeLineActions,
            currentQuery,
            currentUser,
            eventsIndex: this.state.eventsIndex
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
