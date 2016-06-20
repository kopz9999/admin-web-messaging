import {
  REQUEST_ACCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_USER,
} from '../constants/ActionTypes';

const initialState = {
  token: null,
  userName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
};

export default function(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_ACCESS:
      return {
        ...state,
        isAuthenticating: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: payload.token,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        statusText: payload.statusText
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
}
