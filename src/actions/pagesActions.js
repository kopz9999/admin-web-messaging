// Libs
import fetch from 'isomorphic-fetch';
// App
import {
  REQUEST_PAGE,
  RECEIVE_PAGE
} from '../constants/ActionTypes';
import {
  PAGES_API,
} from '../constants/Endpoints';
import {
  pageFactoryInstance,
} from '../models/Page';

function requestPage(pageId) {
  return {
    type: REQUEST_PAGE,
    payload: {
      pageId
    }
  }
}

function receivePage(pageId, page) {
  return {
    type: RECEIVE_PAGE,
    payload: {
      pageId,
      page
    }
  }
}

function shouldFetchPage(state, pageId) {
  const page = state.pages[pageId];
  if (!page) {
    return true
  } else {
    return !page.isFetching
  }
}

export function fetchPage(pageId) {
  return function (dispatch) {
    dispatch(requestPage(pageId));
    var pageURL = new URL(PAGES_API);
    pageURL.pathname += `/${pageId}`;
    return fetch(pageURL.toString())
      .then(response => response.json())
      .then(json =>
        dispatch(receivePage(pageId,
          pageFactoryInstance.buildFromAPI(json)))
      );
  }
}

export function verifyFetchPage(pageId) {
  return (dispatch, getState) => {
    if (shouldFetchPage(getState(), pageId)) {
      return dispatch(fetchPage(pageId));
    } else {
      return Promise.resolve()
    }
  }
}
