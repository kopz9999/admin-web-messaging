// Libs
import fetch from 'isomorphic-fetch';
import { urlWithParams } from '../utils/Helper';
// App
import {
  REQUEST_LAYER_USER,
  RECEIVE_LAYER_USER,
  NOT_FOUND_LAYER_USER,
} from '../constants/ActionTypes';
import {
  USERS_API,
} from '../constants/Endpoints';
import {
  userFactoryInstance,
} from '../models/User';

function requestLayerUser(layerId) {
  return {
    type: REQUEST_LAYER_USER,
    payload: {
      layerId,
    }
  }
}

export function receiveLayerUser(layerId, layerUser) {
  return {
    type: RECEIVE_LAYER_USER,
    payload: {
      layerId,
      layerUser,
    }
  }
}

function notFoundLayerUser(layerId) {
  return {
    type: NOT_FOUND_LAYER_USER,
    payload: {
      layerId,
    }
  }
}

export function shouldFetchLayerUser(state, layerId) {
  const userState = state.layerUsers[layerId];
  if (!userState) {
    return true
  } else {
    return !userState.layerUser && !userState.isFetching;
  }
}

export function getLayerUser(state, layerId) {
  const userState = state.layerUsers[layerId];
  if (!userState) {
    return null;
  } else {
    return (!userState.isFetching && userState.layerUser) ?
      userState.layerUser : null;
  }
}

export function fetchLayerUser(layerId) {
  return function (dispatch) {
    dispatch(requestLayerUser(layerId));
    var usersAPI = urlWithParams(USERS_API, { layerId: layerId });
    return fetch(usersAPI)
      .then(response => response.json())
      .then(json => (
        (json.length > 0) ?
          dispatch(receiveLayerUser(layerId,
            userFactoryInstance.buildFromAPI(json[0]))) :
          dispatch(notFoundLayerUser(layerId))
      ));
  }
}

export function verifyFetchLayerUser(layerId) {
  return (dispatch, getState) => {
    if (shouldFetchLayerUser(getState(), layerId)) {
      return dispatch(fetchLayerUser(layerId));
    } else {
      return Promise.resolve()
    }
  }
}
