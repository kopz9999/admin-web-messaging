import {
  REQUEST_SITE,
  RECEIVE_SITE,
  RECEIVE_EVENTS,
} from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  site: null
};

function site(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_SITE:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_EVENTS:
    case RECEIVE_SITE:
      return {
        ...state,
        isFetching: false,
        site: payload.site,
      };
    default:
      return state;
  }
}

export default function sites(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_SITE:
    case RECEIVE_SITE:
      return {
        ...state,
        [payload.siteId]: site(state[payload.siteId], action)
      };
    case RECEIVE_EVENTS: // Make a cache of all pages
      let nextState = {};
      payload.events.forEach((event) => {
        let requestSite = event.site;
        let siteState = state[requestSite.id];
        if (siteState) {
          if (!siteState.site && !siteState.isFetching) {
            nextState[requestSite.id] = site(siteState,
              { type, payload: { site: requestSite } });
          }
        } else {
          nextState[requestSite.id] = site(siteState,
            { type, payload: { site: requestSite } });
        }
      });
      return Object.assign({}, state, nextState);
    default:
      return state
  }
}
