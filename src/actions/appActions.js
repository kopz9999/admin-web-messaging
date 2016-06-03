import {
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
  LOGOUT,
} from '../constants/ActionTypes';

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
    const json = {
      "id": 2,
      "name": "Jana Matic",
      "email": "jana@curaytor.com",
      "headshot": "gpbbqxcpnbk9yttqfghl",
      "sites": [
        {
          "id": 1,
          "domain": "curaytor.com"
        }
      ]
    };
    dispatch(requestUserInfo());
    return dispatch(receiveUserInfo(
      userFactoryInstance.buildFromBaseAPI(json)
    ));
  }
}
