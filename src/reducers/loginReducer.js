import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REQUEST_ACCESS,
} from '../constants/ActionTypes';

const initialState = {
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
    default:
      return state;
  }
}
