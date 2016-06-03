import {
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
  LOGOUT,
} from '../constants/ActionTypes';
import { USER_INFO_ENDPOINT } from '../constants/Endpoints';
import { urlWithParams, getCookie } from '../utils/Helper';

import {
  userFactoryInstance
} from '../models/User';

export function requestUserInfo() {
  return {
    type: REQUEST_USER_INFO,
  };
}

export function logout() {
  return {
    type: LOGOUT,
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

export function fetchUserInfo() {
  return (dispatch) => {
    const result = getCookie('jwt');
    dispatch(requestUserInfo());
    if (result.trim() == '') {
      dispatch(logout());
      return Promise.resolve();
    } else {
      return fetch(urlWithParams(USER_INFO_ENDPOINT, { token: result }))
        .then(response => response.json())
        .then(json => {
          dispatch(receiveUserInfo(userFactoryInstance.buildFromBaseAPI(json)));
        }).catch(() => dispatch(logout()) );

      // return dispatch(receiveUserInfo(
      // userFactoryInstance.buildFromBaseAPI(json)
      // ));
    }
  }
}
