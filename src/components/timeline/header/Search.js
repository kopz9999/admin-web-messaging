import React, { Component } from 'react';
import styles from './Search.css';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: false,
    }
  }

  handleChange(event) {
    const { value } = event.target;
    this.props.onSearchChange(this.props.eventsIndex, value, Date.now(),
      this.props.eventPagination);
    if (value.length > 0) {
      this.setState({searching: true});
    } else {
      this.setState({searching: false});
    }
  }

  clearBox() {
    this.props.onSearchChange(this.props.eventsIndex, '', Date.now(),
      this.props.eventPagination);
    this.setState({searching: false});
  }

  render() {
    let inlineStyles = this.state.searching ? {} : { display: 'none' };

    return (
      <div className={styles.search}>
        <div className={styles.box}>
          <i className={styles.icon}></i>
          <input onChange={this.handleChange.bind(this)}
                 className={styles.text}
                 type="text"
                 value={this.props.currentSearch}
                 placeholder="Search" />
        </div>
        <div onClick={this.clearBox.bind(this)} className={styles.closeButton} style={inlineStyles}>
          <i className={styles.icon}></i>
          Clear Search
        </div>
      </div>
    );
  }
}
