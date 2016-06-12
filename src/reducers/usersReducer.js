// TODO: Consider removing
import {
  REQUEST_USER,
  RECEIVE_USER,
  RECEIVE_EVENTS,
} from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  user: null
};

function user(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_USER:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_EVENTS:
    case RECEIVE_USER:
      return {
        ...state,
        isFetching: false,
        user: payload.user,
      };
    default:
      return state;
  }
}

export default function users(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_USER:
    case RECEIVE_USER:
      return {
        ...state,
        [payload.layerId]: user(state[payload.layerId], action)
      };
    default:
      return state
  }
}
