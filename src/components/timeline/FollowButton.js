// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// App
import styles from './FollowButton.css'
// Actions
import * as SubjectsActions from '../../actions/subjectsActions';

function mapDispatchToProps(dispatch) {
  return {
    subjectsActions: bindActionCreators(SubjectsActions, dispatch),
  };
}

@connect(null, mapDispatchToProps)
export default class FollowButton extends Component {
  static propTypes = {
    subject: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  follow() {
    const { subject, updateParentContainer } = this.props;
    const { followUser } = this.props.subjectsActions;
    followUser(subject);
    this.setState({hover: true});
    updateParentContainer();
  }

  unFollow() {
    const { subject, updateParentContainer } = this.props;
    const { unFollowUser } = this.props.subjectsActions;
    unFollowUser(subject);
    updateParentContainer();
  }

  renderFollowButton() {
    this.state.hover = false;
    return (
      <div onClick={this.follow.bind(this)}
           className={styles.follow}>
        <span>Magic</span>
      </div>
    );
  }

  onMouseOver() {
    this.setState({hover: true});
  }

  onMouseOut() {
    this.setState({hover: false});
  }

  renderFollowingButton() {
    let text = this.state.hover ? 'Dispel' : 'Doing Magic';
    return (
      <div onClick={this.unFollow.bind(this)}
           className={styles.following}
           onMouseOver={this.onMouseOver.bind(this)}
           onMouseOut={this.onMouseOut.bind(this)}>
        <span>{text}</span>
      </div>
    );
  }

  render() {
    const { subject } = this.props;
    return subject.isSubject ?
      this.renderFollowingButton() : this.renderFollowButton();
  }
}
