import {
  REQUEST_PAGE,
  RECEIVE_PAGE,
  RECEIVE_EVENTS,
} from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  page: null
};

function page(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_PAGE:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_EVENTS:
    case RECEIVE_PAGE:
      return {
        ...state,
        isFetching: false,
        page: payload.page,
      };
    default:
      return state;
  }
}

export default function pages(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_PAGE:
    case RECEIVE_PAGE:
      return {
        ...state,
        [payload.pageId]: page(state[payload.pageId], action)
      };
    case RECEIVE_EVENTS: // Make a cache of all pages
      let nextState = {};
      payload.events.forEach((event) => {
        let requestPage = event.content.page;
        nextState[requestPage.id] = page(state[requestPage.id],
          { type, payload: { page: requestPage } });
      });
      return Object.assign({}, state, nextState);
    default:
      return state
  }
}
