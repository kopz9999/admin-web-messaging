import {
  LOGIN_SUCCESS
} from '../constants/ActionTypes';

const initialState = {
  loggedIn: false,
};

export default function(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
      };
    default:
      return state;
  }
}
