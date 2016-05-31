// Libs
import fetch from 'isomorphic-fetch';
import { urlWithParams } from '../utils/Helper';
// App
import {
  REQUEST_USER,
  RECEIVE_USER,
  NOT_FOUND_USER,
} from '../constants/ActionTypes';
import {
  USERS_API,
} from '../constants/Endpoints';
import {
  userFactoryInstance,
} from '../models/User';

function requestUser(layerId) {
  return {
    type: REQUEST_USER,
    payload: {
      layerId
    }
  }
}

export function receiveUser(layerId, user) {
  return {
    type: RECEIVE_USER,
    payload: {
      layerId,
      user
    }
  }
}

function notFoundUser(layerId) {
  return {
    type: NOT_FOUND_USER,
    payload: {
      layerId,
    }
  }
}

function shouldFetchUser(state, layerId) {
  const userState = state.users[layerId];
  if (!userState) {
    return true
  } else {
    return !userState.user && !userState.isFetching;
  }
}

export function fetchUser(layerId) {
  return function (dispatch) {
    dispatch(requestUser(layerId));
    var usersAPI = urlWithParams(USERS_API, { layerId: layerId });
    return fetch(usersAPI)
      .then(response => response.json())
      .then(json => (
        (json.length > 0) ?
          dispatch(receiveUser(layerId,
            userFactoryInstance.buildFromAPI(json[0]))) :
          dispatch(notFoundUser(layerId))
      ));
  }
}

export function verifyFetchUser(layerId) {
  return (dispatch, getState) => {
    if (shouldFetchUser(getState(), layerId)) {
      return dispatch(fetchUser(layerId));
    } else {
      return Promise.resolve()
    }
  }
}
