// React
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// App
import Header from './Header';
import styles from './Wrapper.css';
// Actions
import * as TimeLineActions from '../../actions/timeLineActions';

function mapStateToProps({ timeLine, settings, router }) {
  return {
    timeLine,
    settings,
    // activeConversationId: `layer:///conversations/${router.params.conversationId}`
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(TimeLineActions, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Wrapper extends Component {
  render() {
    const { timeLine, settings, actions } = this.props;
    return (
      <div className={styles.content}>
        <Header />
        <div className={styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            ...timeLine,
            ...actions,
            settings
          })}
        </div>
      </div>
    );
  }
}
