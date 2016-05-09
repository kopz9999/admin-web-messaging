import React, { Component } from 'react';
import Header from './Header';
import styles from './Wrapper.css';

export default class Wrapper extends Component {
  render() {
    return (
      <div className={styles.content}>
        <Header />
        <div className={styles.container}>
          {this.props.children && React.cloneElement(this.props.children, {
          })}
        </div>
      </div>
    );
  }
}
