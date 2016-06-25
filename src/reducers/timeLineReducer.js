import {
  REQUEST_EVENTS,
  QUERY_EVENTS,
  LOAD_MORE_EVENTS,
  RECEIVE_EVENTS,
  SEARCH_CHANGE,
} from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  eventPagination: 250,
  fromTimestamp: null,
  currentSearch: '',
  events: [],
};

export default function timeLineReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
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
