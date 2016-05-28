import fetch from 'isomorphic-fetch';
import {
  REQUEST_EVENTS,
  RECEIVE_EVENTS
} from '../constants/ActionTypes';
import {
  EVENTS_API,
} from '../constants/Endpoints';

function requestEvents() {
  return {
    type: REQUEST_EVENTS,
  }
}

function receiveEvents(events) {
  return {
    type: RECEIVE_EVENTS,
    payload: {
      events
    }
  }
}

export function fetchEvents() {
  return function (dispatch) {
    dispatch(requestEvents());

    return fetch(EVENTS_API)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveEvents(json))
      );
  }
}