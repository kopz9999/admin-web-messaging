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
import { setupAlgoliaClient } from './algoliaActions';
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
        dispatch(initUserLayerClient('layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8'));
        dispatch(setupAlgoliaClient('V0L0EPPR59',
          '363cd668faa7d392287982a6cb352d26'))
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
