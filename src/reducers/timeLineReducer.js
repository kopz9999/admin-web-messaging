import {
  REQUEST_EVENTS,
  QUERY_EVENTS,
  LOAD_MORE_EVENTS,
  RECEIVE_EVENTS,
  SEARCH_CHANGE,
  SET_EVENTS_TIMEOUT,
  CLEAR_EVENTS_TIMEOUT,
} from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  eventPagination: 250,
  fromTimestamp: null,
  currentTimeout: null,
  currentSearch: '',
  events: [],
};

export default function timeLineReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SET_EVENTS_TIMEOUT:
      return {
        ...state,
        currentTimeout: payload.currentTimeout
      };
    case CLEAR_EVENTS_TIMEOUT:
      return {
        ...state,
        currentTimeout: null,
      };
    case REQUEST_EVENTS:
      return {
        ...state,
        isFetching: true,
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
        eventPagination: state.eventPagination + 50
      };
    case SEARCH_CHANGE:
      return {
        ...state,
        currentSearch: payload.currentSearch
      };
    default:
      return state;
  }
}
