import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
// App Assets
import styles from './Header.css';
import logo from './images/logo.png';
// App Components
import Search from '../../components/timeline/header/Search';
import Site from '../../components/timeline/header/Site';
import Page from '../../components/timeline/header/Page';
import User from '../../components/timeline/header/User';
import Notification from '../../components/timeline/Notification';
// Actions
import * as PagesActions from '../../actions/pagesActions';
import * as SitesActions from '../../actions/sitesActions';
import * as UsersActions from '../../actions/usersActions';

function mapStateToProps({ pages, sites, users }) {
  return {
    pages,
    sites,
    users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pagesActions: bindActionCreators(PagesActions, dispatch),
    sitesActions: bindActionCreators(SitesActions, dispatch),
    usersActions: bindActionCreators(UsersActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Header extends Component {
  renderNewConversation() {
    return (
      <Link to='/home' className={styles.newConversation}>
        <div className={styles.icon}></div>
        <div className={styles.label}>New Conversation</div>
      </Link>
    );
  }

  componentDidMount() {
    const { siteId, pageId, userId } = this.props;
    const { sitesActions, pagesActions, usersActions } = this.props;
    const { verifyFetchSite } = sitesActions;
    const { verifyFetchPage } = pagesActions;
    const { verifyFetchUser } = usersActions;
    if (siteId) verifyFetchSite(siteId);
    if (pageId) verifyFetchPage(pageId);
    if (userId) verifyFetchUser(userId);
  }

  /*
  componentWillReceiveProps(nextProps) {
    const { siteId, pageId, userId } = this.props;
    const { sitesActions, pagesActions, usersActions } = this.props;
    const { verifyFetchSite } = sitesActions;
    const { verifyFetchPage } = pagesActions;
    const { verifyFetchUser } = usersActions;
    const { siteId: nextSiteId, pageId: nextPageId,
      userId: nextUserId } = nextProps;
    if (nextSiteId && nextSiteId != siteId) verifyFetchSite(nextSiteId);
    if (nextPageId && nextPageId != pageId) verifyFetchPage(nextPageId);
    if (nextUserId && nextUserId != userId) verifyFetchUser(nextUserId);
  }
  */

  renderSite() {
    let site = null;
    const { siteId, sites } = this.props;
    const siteState = sites[siteId];
    if (siteState && siteState.site) {
      site = siteState.site;
      return (
        <Site
          site={{
            id: site.id,
            title: site.name,
            thumbnailURL: site.thumbnail_url
          }}
        />
      );
    } else {
      return null;
    }
  }

  renderPage() {
    let page = null;
    const { pageId, siteId, pages } = this.props;
    const pageState = pages[pageId];
    if (pageState && pageState.page) {
      page = pageState.page;
      return (
        <Page
          page={{
            siteId,
            id: page.id,
            title: page.name,
            thumbnailURL: page.thumbnail_url
          }}
        />
      );
    } else {
      return null;
    }
  }

  renderUser() {
    const { userId, users } = this.props;
    const userState = users[userId];
    if (userState && userState.user) {
      return (<User site={userState.user} />);
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
          { this.renderSite() }
          { this.renderPage() }
          { this.renderUser() }
          <Search />
        </div>
        <div className={styles.rightContent}>
          { this.renderNewConversation() }
          <Notification />
        </div>
      </div>
    );
  }
}
