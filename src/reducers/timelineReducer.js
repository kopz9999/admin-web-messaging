import {
  REQUEST_EVENTS,
  QUERY_EVENTS,
  LOAD_MORE_EVENTS,
  RECEIVE_EVENTS
} from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  eventPagination: 20,
  fromTimestamp: null,
  events: []
};

export default function timeLineReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_EVENTS:
      return {
        ...state,
        isFetching: true,
        events: [],
        fromTimestamp: payload.fromTimestamp
      };
    case RECEIVE_EVENTS:
      return {
        ...state,
        isFetching: false,
        events: payload.events,
      };
    case LOAD_MORE_EVENTS:
      return {
        ...state,
        eventPagination: state.eventPagination + 20
      };
    default:
      return state;
  }
}
