import {
  REQUEST_CONVERSATIONS_USERS,
  RECEIVE_CONVERSATIONS_USERS
} from '../constants/ActionTypes';

const initialState = {
  usersLoaded: false,
  loadingUsers: false,
};

export default function(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case REQUEST_CONVERSATIONS_USERS:
      return {
        ...state,
        loadingUsers: true,
      };
    case RECEIVE_CONVERSATIONS_USERS:
      return {
        ...state,
        loadingUsers: false,
        usersLoaded: true,
      };
    default:
      return state;
  }
}
