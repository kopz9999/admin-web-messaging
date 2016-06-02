import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REQUEST_ACCESS,
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
} from '../constants/ActionTypes';

const initialState = {
  currentUser: null,
  loggedIn: false,
  loginFailed: false,
};

export default function(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_ACCESS:
      return {
        ...state,
        loginFailed: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loginFailed: true,
      };
    case RECEIVE_USER_INFO:
      return {
        ...state,
        currentUser: payload.currentUser,
      };
    default:
      return state;
  }
}
