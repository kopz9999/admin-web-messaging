import {
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
} from '../constants/ActionTypes';

const initialState = {
  isFetchingCurrentUser: false,
  currentUser: null,
  userLoaded: false,
  loggedOut: false,
  users: [],
};

export default function appReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
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
