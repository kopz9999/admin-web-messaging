// React
import React, { Component } from 'react';
// Layer
import { connectQuery } from 'layer-react';
import { QueryBuilder } from 'layer-sdk';
// App
import Header from './Header';
import styles from './Wrapper.css';

function getQueries() {
  return {
    conversations:
      QueryBuilder.conversations().sortBy('lastMessage.sentAt', false)
  };
}

@connectQuery({}, getQueries)
export default class Wrapper extends Component {
  render() {
    const { conversations } = this.props;
    return (
      <div className={styles.content}>
        <Header />
        <div className={styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
            conversations
          })}
        </div>
      </div>
    );
  }
}
