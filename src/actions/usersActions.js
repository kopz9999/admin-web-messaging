// Libs
import fetch from 'isomorphic-fetch';
// App
import {
  REQUEST_USER,
  RECEIVE_USER
} from '../constants/ActionTypes';

import {
  USERS_API,
} from '../constants/Endpoints';

function requestUser(userId) {
  return {
    type: REQUEST_USER,
    payload: {
      userId
    }
  }
}

function receiveUser(userId, user) {
  return {
    type: RECEIVE_USER,
    payload: {
      userId,
      user
    }
  }
}

function shouldFetchUser(state, userId) {
  const user = state.users[userId];
  if (!user) {
    return true
  } else {
    return !user.isFetching
  }
}

export function fetchUser(userId) {
  return function (dispatch) {
    dispatch(requestUser(userId));
    var pageURL = new URL(USERS_API);
    pageURL.pathname += `/${userId}`;
    return fetch(pageURL.toString())
      .then(response => response.json())
      .then(json =>
        dispatch(receiveUser(userId, json))
      );
  }
}

export function verifyFetchUser(userId) {
  return (dispatch, getState) => {
    if (shouldFetchUser(getState(), userId)) {
      return dispatch(fetchUser(userId));
    } else {
      return Promise.resolve()
    }
  }
}
