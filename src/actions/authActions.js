// React
import { pushState } from 'redux-router';
// Libs
import fetch from 'isomorphic-fetch';
// App
import {
  REQUEST_ACCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_USER,
} from '../constants/ActionTypes';
import {
  LOGIN_ENDPOINT,
} from '../constants/Endpoints';

export function requestAccess() {
  return {
    type: REQUEST_ACCESS,
  };
}

export function logout() {
  localStorage.removeItem('token');
  return {
    type: LOGOUT_USER,
  };
}

export function loginSuccess(token) {
  localStorage.setItem('token', token);
  return {
    type: LOGIN_SUCCESS,
    payload: {
      token
    }
  };
}

export function loginFail(error) {
  localStorage.removeItem('token');
  return {
    type: LOGIN_FAIL,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function doLogin(username, password, redirect="/home") {
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
      .then(json => {
        dispatch(loginSuccess(json.jwt));
        dispatch(pushState(null, redirect));
      })
      .catch(error => dispatch(loginFail({
        response: {
          statusText: 'Authentication Failed'
        }
      })) );
  }
}
