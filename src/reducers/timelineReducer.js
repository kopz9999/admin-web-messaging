import {
  REQUEST_EVENTS,
  REQUEST_QUERY_EVENTS,
  RECEIVE_EVENTS
} from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  events: []
};

export default function timeLineReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_EVENTS:
      return {
        ...state,
        isFetching: true,
        events: []
      };
    case RECEIVE_EVENTS:
      return {
        ...state,
        isFetching: false,
        events: payload.events,
      };
    default:
      return state;
  }
}
