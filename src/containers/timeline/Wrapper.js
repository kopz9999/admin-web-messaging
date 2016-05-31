// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Layer
import { connectQuery } from 'layer-react';
import { QueryBuilder } from 'layer-sdk';
// App
import Header from './Header';
import styles from './Wrapper.css';

function mapStateToProps({ router }) {
  return {
    currentQuery: {
      conversationId: router.params.conversationId,
    },
  };
}

function getQueries() {
  return {
    conversations:
      QueryBuilder.conversations().sortBy('lastMessage.sentAt', false)
  };
}

@connect(mapStateToProps)
@connectQuery({}, getQueries)
export default class Wrapper extends Component {
  render() {
    const { conversations, currentQuery } = this.props;
    return (
      <div className={styles.content}>
        <Header />
        <div className={styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            conversations,
            currentQuery,
          })}
        </div>
      </div>
    );
  }
}
