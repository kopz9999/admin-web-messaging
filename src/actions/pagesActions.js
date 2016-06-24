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
  const pageState = state.pages[pageId];
  if (!pageState) {
    return true
  } else {
    return !pageState.page && !pageState.isFetching;
  }
}

export function fetchPage(pagesIndex, pageId) {
  return function (dispatch) {
    dispatch(requestPage(pageId));
    return pagesIndex.getObject(pageId)
      .then(json =>
        dispatch(receivePage(pageId,
          pageFactoryInstance.buildFromAlgolia(json)))
      );
  }
}

export function verifyFetchPage(pageId) {
  return (dispatch, getState) => {
    const state = getState();
    const { pagesIndex } = state.algolia;
    if (shouldFetchPage(state, pageId)) {
      return dispatch(fetchPage(pagesIndex, pageId));
    } else {
      return Promise.resolve()
    }
  }
}
