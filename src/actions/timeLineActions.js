// Libs
import fetch from 'isomorphic-fetch';
import { urlWithParams } from '../utils/Helper';
// App
import {
  REQUEST_EVENTS,
  QUERY_EVENTS,
  RECEIVE_EVENTS,
  SEARCH_CHANGE,
  SET_EVENTS_TIMEOUT,
  CLEAR_EVENTS_TIMEOUT,
  CLEAR_EVENTS,
  LOAD_MORE_EVENTS,
} from '../constants/ActionTypes';
import {
  EVENTS_API,
  EVENTS_QUERY_API,
} from '../constants/Endpoints';
import {
  eventFactoryInstance,
} from '../models/Event';
import {
  userFactoryInstance
} from '../models/User';
import {
  siteFactoryInstance
} from '../models/Site';
import {
  pageFactoryInstance
} from '../models/Page';

import { MESSAGE, VISIT } from '../constants/EventTypes';
// Actions
import {
  getLayerUser,
  receiveLayerUser
} from './layerUsersActions';

const DEFAULT_DOMAIN = 'curaytor.com';

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

function searchChange(currentSearch) {
  return {
    type: SEARCH_CHANGE,
    payload: {
      currentSearch
    }
  }
}

export function setEventsTimeout(currentTimeout) {
  return {
    type: SET_EVENTS_TIMEOUT,
    payload: {
      currentTimeout
    }
  }
}

export function clearEventsTimeout() {
  return {
    type: CLEAR_EVENTS_TIMEOUT,
  }
}

export function clearEvents() {
  return {
    type: CLEAR_EVENTS,
  }
}

export function loadMoreEvents() {
  return {
    type: LOAD_MORE_EVENTS
  }
}

export function doClearEventsTimeout() {
  return (dispatch, getState) => {
    const { currentTimeout } = getState().timeLine;
    if (!isNaN(currentTimeout)) {
      clearTimeout(currentTimeout);
    }
    return dispatch(clearEventsTimeout());
  }
}

export function requestSearch(currentSearch, fromTimestamp, limit){
  return function (dispatch) {
    dispatch(searchChange(currentSearch));
    return dispatch(fetchEvents(fromTimestamp, limit, true));
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

function registerLayerUser(dispatch, state, rawUser) {
  const { layer_id: layerId } = rawUser;
  let user = getLayerUser(state, layerId);
  if (user == null) {
    user = userFactoryInstance.buildFromEvent(rawUser);
    dispatch(receiveLayerUser(layerId, user));
  }
  return user;
}

function processEvents(rawEvents) {
  return function(dispatch, getState) {
    let events = [], eventObject, layerMessage;
    const state = getState();
    rawEvents.forEach((evt) => {
      eventObject = eventFactoryInstance.buildFromAlgolia(evt);
      if (evt.site) {
        eventObject.site = siteFactoryInstance.buildFromEvent(evt.site);
      }
      if (evt.page) {
        eventObject.page = pageFactoryInstance.buildFromEvent(evt.page);
      }
      switch (eventObject.type) {
        case MESSAGE:
          eventObject.user = registerLayerUser(dispatch, state, evt.user);
          if (evt.backend_user) {
            eventObject.backendUser = registerLayerUser(dispatch, state,
              evt.backend_user);
          }
          if (eventObject.message &&
            (layerMessage = state.timeLine.layerMessages[eventObject.message.id])) {
            eventObject.layerMessage = layerMessage;
          }
          evt.users.forEach((usr) => {
            eventObject.users.push(
              registerLayerUser(dispatch, state, usr)
            );
          });
          break;
        case VISIT:
          eventObject.user = registerLayerUser(dispatch, state, evt.user);
          break;
      }
      events.push(eventObject);
    });
    return dispatch(receiveEvents(events));
  }
}

function getFacetFilters(state) {
  let filters = [];
  const { params } = state.router;
  if (params && Object.keys(params).length > 0) {
    if (params.siteId) filters.push("site.object_id:" + params.siteId);
    if (params.pageId) filters.push("page.object_id:" + params.pageId);
    if (params.layerId) filters.push("user.layer_id:" + params.layerId);
  } else {
    filters.push("site.domain:" + DEFAULT_DOMAIN);
  }
  return filters;
}

export function fetchEvents(fromTimestamp, limit, useCache=false) {
  return function (dispatch, getState) {
    const state = getState();
    const { eventsIndex } = state.algolia;
    const query = { hitsPerPage: limit, facetFilters: getFacetFilters(state) };
    eventFactoryInstance.settings = state.settings;
    if (!useCache) eventsIndex.clearCache();
    dispatch(requestEvents(fromTimestamp));
    return eventsIndex.search(state.timeLine.currentSearch, query)
      .then(content =>
        dispatch(processEvents(content.hits))
      );
  }
}

export function doFetchEvents(interval) {
  return (dispatch, getState) => {
    const state = getState();
    return dispatch(fetchEvents(Date.now(), state.timeLine.eventPagination)).then(()=> {
      /* NOTE: Comment this line to stop the flow */
      dispatch(setEventsTimeout(setTimeout(()=> dispatch(doFetchEvents(interval)), interval)));
    });
  }
}

export function liveFetchEvents(interval = 1000) {
  return function (dispatch, getState) {
    dispatch(doClearEventsTimeout());
    return dispatch(doFetchEvents(interval));
  };
}
