import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

export default class Avatar extends Component {

  static propTypes = {
    user: PropTypes.string,
    users: PropTypes.array
  }

  renderUserItem = (user) => {
    var names = user.split(' ');
    var displayInitials;
    if (names.length > 1) {
      displayInitials = (names[0][0] + names[1][0]).toUpperCase();
    } else {
      displayInitials = user.substr(0, 2).toUpperCase();
    }
    return <span key={user}>{displayInitials}</span>;
  }

  render() {
    const { user, users } = this.props;
    let usersToRender = user ? [user] : [users[0]]; //users.slice(-1);
    let styles = cx({
      'media-object': true,
      'pull-left': true,
      avatar: true,
      cluster: usersToRender && usersToRender.length > 1
    });

    return <div className={styles}>{usersToRender.map(this.renderUserItem)}</div>;
  }
}
