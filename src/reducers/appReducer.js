import {
  CLIENT_READY,
  FETCH_USERS_SUCCESS,
} from '../actions/messenger';
import {
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
} from '../constants/ActionTypes';

const initialState = {
  ready: false,
  usersLoaded: false,
  isFetchingCurrentUser: false,
  currentUser: null,
  userLoaded: false,
  loggedOut: false,
  users: [],
};

export default function appReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case CLIENT_READY:
      return {
        ...state,
        ready: state.usersLoaded,
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        usersLoaded: true,
        users: payload.users
      };
    case REQUEST_USER_INFO:
      return {
        ...state,
        isFetchingCurrentUser: true,
      };
    case RECEIVE_USER_INFO:
      return {
        ...state,
        isFetchingCurrentUser: false,
        currentUser: payload.currentUser,
        userLoaded: true,
      };
    default:
      return state;
  }
}
