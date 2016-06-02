// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
// App
import Header from './Header';
import styles from './Wrapper.css';

function mapStateToProps({ router }) {
  return {
    currentQuery: {
      layerId: router.params.layerId,
      conversationId: router.params.conversationId,
    },
  };
}

@connect(mapStateToProps)
export default class Wrapper extends Component {
  render() {
    const { currentQuery } = this.props;
    return (
      <div className={styles.content}>
        <Header {...currentQuery} />
        <div className={styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            currentQuery,
          })}
        </div>
      </div>
    );
  }
}
