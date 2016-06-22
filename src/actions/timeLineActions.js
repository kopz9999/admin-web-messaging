// Libs
import fetch from 'isomorphic-fetch';
import { urlWithParams } from '../utils/Helper';
// App
import {
  REQUEST_EVENTS,
  QUERY_EVENTS,
  RECEIVE_EVENTS,
  SEARCH_CHANGE,
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

export function requestSearch(index, currentSearch, fromTimestamp, limit){
  return function (dispatch) {
    dispatch(searchChange(currentSearch));
    return dispatch(fetchEvents(index, fromTimestamp, limit, true));
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

function registerLayerUser(dispatch, layerUsers, conversationId, rawUser) {
  let user = null, layerUserState;
  const { layer_id: layerId } = rawUser;
  if (layerUsers[conversationId]) {
    if (layerUserState = layerUsers[conversationId][layerId]) {
      if (!layerUserState.isFetching) {
        user = layerUserState.layerUser;
      }
    }
  }
  if (user == null) {
    user = userFactoryInstance.buildFromEvent(rawUser);
    dispatch(receiveLayerUser( conversationId, layerId, user));
  }
  return user;
}

function processEvents(rawEvents) {
  return function(dispatch, getState) {
    let events = [], eventObject;
    const { layerUsers } = getState();
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
          eventObject.user = registerLayerUser(dispatch, layerUsers,
            eventObject.message.conversationId, evt.user);
          if (evt.backend_user) {
            eventObject.backendUser = registerLayerUser(dispatch, layerUsers,
              eventObject.message.conversationId, evt.backend_user);
          }
          evt.users.forEach((usr) => {
            eventObject.users.push(
              registerLayerUser(dispatch, layerUsers,
                eventObject.message.conversationId, usr)
            );
          });
          break;
        case VISIT:
          eventObject.user = userFactoryInstance.buildFromEvent(evt.user);
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
  } else {
    filters.push("site.domain:" + DEFAULT_DOMAIN);
  }
  return filters;
}

export function fetchEvents(index, fromTimestamp, limit, useCache=false) {
  return function (dispatch, getState) {
    const state = getState();
    const query = { hitsPerPage: limit, facetFilters: getFacetFilters(state) };
    eventFactoryInstance.settings = state.settings;
    if (!useCache) index.clearCache();
    dispatch(requestEvents(fromTimestamp));
    return index.search(state.timeLine.currentSearch, query)
      .then(content =>
        dispatch(processEvents(content.hits))
      );
  }
}
