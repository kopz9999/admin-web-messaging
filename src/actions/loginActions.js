// Libs
import fetch from 'isomorphic-fetch';
// App
import {
  REQUEST_ACCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from '../constants/ActionTypes';
import {
  LOGIN_ENDPOINT,
} from '../constants/Endpoints';

export function requestAccess() {
  return {
    type: REQUEST_ACCESS,
  };
}

export function loginSuccess() {
  return {
    type: LOGIN_SUCCESS,
  };
}

export function loginFail() {
  return {
    type: LOGIN_FAIL,
  };
}

export function doLogin(username, password) {
  return function (dispatch) {
    dispatch(requestAccess());
    const payload = {
      "auth": {
        "site_id": "curaytor.com",
        "email": username,
        "password": password
      }
    };
    return fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(json => dispatch(loginSuccess())
      ).catch(() => dispatch(loginFail()) );
  }
}
