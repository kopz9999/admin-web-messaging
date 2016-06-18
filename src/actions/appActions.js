// React
import { pushState } from 'redux-router';
// App
import {
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
} from '../constants/ActionTypes';
import { USER_INFO_ENDPOINT } from '../constants/Endpoints';
import { urlWithParams } from '../utils/Helper';
import { initUserLayerClient } from './layerClientActions';
import { loginFail } from './authActions';

import {
  userFactoryInstance
} from '../models/User';

export function requestUserInfo() {
  return {
    type: REQUEST_USER_INFO,
  };
}

export function receiveUserInfo(currentUser) {
  return {
    type: RECEIVE_USER_INFO,
    payload: {
      currentUser
    }
  };
}

export function fetchUserInfo(token) {
  return (dispatch, getState) => {
    dispatch(requestUserInfo());
    return fetch(urlWithParams(USER_INFO_ENDPOINT, { token }))
      .then(response => response.json())
      .then(json => {
        dispatch(
          receiveUserInfo(
            userFactoryInstance.buildFromBaseAPI(json, getState().settings)
          )
        );
        dispatch(initUserLayerClient());
      })
      .catch(error => {
        console.log(error);
        dispatch(loginFail({
          response: {
            statusText: 'Identification failed'
          }
        }));
        dispatch(pushState(null, '/'));
      });

  }
}
