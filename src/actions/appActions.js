// React
import { pushState } from 'redux-router';
// App
import {
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
} from '../constants/ActionTypes';
import { APP_INFO_API } from '../constants/Endpoints';
import { urlWithParams } from '../utils/Helper';
import { initUserLayerClient } from './layerClientActions';
import { setupAlgoliaClient } from './algoliaActions';
import { loginFail } from './authActions';
import { processUserSubjects } from './subjectsActions';

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
    let currentUser;
    dispatch(requestUserInfo());
    return fetch(APP_INFO_API, {
        headers: { 'X-Auth-Token': token }
      })
      .then(response => response.json())
      .then(info => {
        currentUser = userFactoryInstance.buildFromMessagingAPI(info.user);
        dispatch(receiveUserInfo(currentUser));
        dispatch(processUserSubjects(info.user));
        dispatch(initUserLayerClient(info.layer.app_id));
        dispatch(setupAlgoliaClient(info.algolia.application_id,
          info.algolia.api_key));
        setupNotificationServiceWorker(currentUser);
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
