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

function requestLayerUser(conversationId, layerId) {
  return {
    type: REQUEST_LAYER_USER,
    payload: {
      conversationId,
      layerId,
    }
  }
}

export function receiveLayerUser(conversationId, layerId, layerUser) {
  return {
    type: RECEIVE_LAYER_USER,
    payload: {
      conversationId,
      layerId,
      layerUser,
    }
  }
}

function notFoundLayerUser(conversationId, layerId) {
  return {
    type: NOT_FOUND_LAYER_USER,
    payload: {
      conversationId,
      layerId,
    }
  }
}

function shouldFetchLayerUser(state, conversationId, layerId) {
  const userState = state.layerUsers[conversationId] ?
    state.layerUsers[conversationId][layerId] : null;
  if (!userState) {
    return true
  } else {
    return !userState.layerUser && !userState.isFetching;
  }
}

/*
* TODO: Search in users store before
* */
export function fetchLayerUser(conversationId, layerId) {
  return function (dispatch) {
    dispatch(requestLayerUser(conversationId, layerId));
    var usersAPI = urlWithParams(USERS_API, { layerId: layerId });
    return fetch(usersAPI)
      .then(response => response.json())
      .then(json => (
        (json.length > 0) ?
          dispatch(receiveLayerUser(conversationId, layerId,
            userFactoryInstance.buildFromAPI(json[0]))) :
          dispatch(notFoundLayerUser(conversationId, layerId))
      ));
  }
}

export function verifyFetchLayerUser(conversationId, layerId) {
  return (dispatch, getState) => {
    if (shouldFetchLayerUser(getState(), conversationId, layerId)) {
      return dispatch(
        receiveLayerUser(conversationId, layerId,
          userFactoryInstance.buildUnknownUser({ layerId }))
      );
    } else {
      return Promise.resolve()
    }
  }
}
