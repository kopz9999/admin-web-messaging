// Libs
import fetch from 'isomorphic-fetch';
// App
import {
  REQUEST_SITE,
  RECEIVE_SITE
} from '../constants/ActionTypes';
import {
  SITES_API,
} from '../constants/Endpoints';
import {
  siteFactoryInstance,
} from '../models/Site';

function requestSite(siteId) {
  return {
    type: REQUEST_SITE,
    payload: {
      siteId
    }
  }
}

function receiveSite(siteId, site) {
  return {
    type: RECEIVE_SITE,
    payload: {
      siteId,
      site
    }
  }
}

function shouldFetchSite(state, siteId) {
  const siteState = state.sites[siteId];
  if (!siteState) {
    return true
  } else {
    return !siteState.site && !siteState.isFetching;
  }
}

export function fetchSite(siteId) {
  return function (dispatch) {
    dispatch(requestSite(siteId));
    var pageURL = new URL(SITES_API);
    pageURL.pathname += `/${siteId}`;
    return fetch(pageURL.toString())
      .then(response => response.json())
      .then(json =>
        dispatch(receiveSite(siteId,
          siteFactoryInstance.buildFromAPI(json)))
      );
  }
}

export function verifyFetchSite(siteId) {
  return (dispatch, getState) => {
    if (shouldFetchSite(getState(), siteId)) {
      return dispatch(fetchSite(siteId));
    } else {
      return Promise.resolve()
    }
  }
}
