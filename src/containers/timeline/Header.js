// Redux
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
// App
import { getLayerConversationId } from '../../utils/Helper';
// App Assets
import styles from './Header.css';
import logo from './images/logo.png';
// App Components
import User from '../../components/timeline/header/User';
import Search from '../../components/timeline/header/Search';
import Page from '../../components/timeline/header/Page';
// Actions
import * as PagesActions from '../../actions/pagesActions';

function mapStateToProps({ pages, layerUsers }) {
  return {
    pages,
    layerUsers,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pagesActions: bindActionCreators(PagesActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Header extends Component {
  retrievePage(pageId) {
    const { pagesIndex } = this.props;
    const { verifyFetchPage } = this.props.pagesActions;
    verifyFetchPage(pagesIndex, pageId);
  }

  componentDidMount() {
    if (this.props.pageId) this.retrievePage(this.props.pageId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageId != this.props.pageId && nextProps.pageId) {
      this.retrievePage(nextProps.pageId);
    }
  }

  renderNewConversation() {
    return (
      <Link to='/home' className={styles.newConversation}>
        <div className={styles.icon}></div>
        <div className={styles.label}>New Conversation</div>
      </Link>
    );
  }

  renderUser() {
    const { layerId, conversationId, layerUsers } = this.props;
    const conversationUsers =
      layerUsers[getLayerConversationId(conversationId)];
    const userState = conversationUsers ? conversationUsers[layerId] : null;
    if (userState && userState.layerUser) {
      return (
        <User
          conversationId={conversationId}
          user={userState.layerUser}
        />
      );
    } else {
      return null;
    }
  }

  renderPage() {
    const { pageId, siteId, pages } = this.props;
    const pageState = pages[pageId];
    if (pageState && pageState.page) {
      return (<Page siteId={siteId} page={pageState.page} />);
    } else {
      return null;
    }
  }

  renderSearch() {
    const { layerId, conversationId, timeLineActions, timeLine,
      eventsIndex, pageId } = this.props;

    if (!layerId && !conversationId && !pageId) {
      return (
        <Search
          eventsIndex={eventsIndex}
          currentSearch={timeLine.currentSearch}
          eventPagination={timeLine.eventPagination}
          onSearchChange={timeLineActions.requestSearch}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.leftContent}>
          <Link to='/home' className={styles.logo}>
            <img src={logo} />
          </Link>
          { this.renderSearch() }
          { this.renderPage() }
          { this.renderUser() }
        </div>
        <div className={styles.rightContent}>
        </div>
      </div>
    );
  }
}
