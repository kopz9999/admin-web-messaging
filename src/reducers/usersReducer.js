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
        [payload.userId]: user(state[payload.userId], action)
      };
    case RECEIVE_EVENTS: // Make a cache of all pages
      let nextState = {};
      payload.events.forEach((event) => {
        let requestUser = event.user;
        let userState = state[requestUser.id];
        if (userState) {
          if (!userState.site && !userState.isFetching) {
            nextState[requestUser.id] = user(state[requestUser.id],
              { type, payload: { user: requestUser } });
          }
        } else {
          nextState[requestUser.id] = user(state[requestUser.id],
            { type, payload: { user: requestUser } });
        }
      });
      return Object.assign({}, state, nextState);
    default:
      return state
  }
}
