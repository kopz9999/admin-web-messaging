// Libs
import fetch from 'isomorphic-fetch';
import { urlWithParams } from '../utils/Helper';
// App
import {
  REQUEST_EVENTS,
  QUERY_EVENTS,
  RECEIVE_EVENTS
} from '../constants/ActionTypes';
import {
  EVENTS_API,
  EVENTS_QUERY_API,
} from '../constants/Endpoints';
import {
  eventFactoryInstance,
} from '../models/Event';

function requestEvents(fromTimestamp) {
  return {
    type: REQUEST_EVENTS,
    payload: {
      fromTimestamp
    }
  }
}

function queryEvents(fromTimestamp, query={}) {
  return {
    type: QUERY_EVENTS,
    payload: {
      fromTimestamp,
      query
    }
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

export function fetchQueryEvents(fromTimestamp, limit, query={}) {
  return function (dispatch, getState) {
    eventFactoryInstance.settings = getState().settings;
    dispatch(queryEvents(fromTimestamp, query));
    var eventsAPI = urlWithParams(EVENTS_QUERY_API,
      { from: fromTimestamp, limit: limit });
    return fetch(eventsAPI, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      })
      .then(response => response.json())
      .then(json =>
        dispatch(receiveEvents(eventFactoryInstance.buildFromAPICollection(json)))
      );
  }
}

export function fetchEvents(fromTimestamp, limit) {
  return function (dispatch, getState) {
    eventFactoryInstance.settings = getState().settings;
    dispatch(requestEvents(fromTimestamp));
    var eventsAPI = urlWithParams(EVENTS_API,
      { from: fromTimestamp, limit: limit });
    return fetch(eventsAPI)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveEvents(eventFactoryInstance.buildFromAPICollection(json)))
      );
  }
}
