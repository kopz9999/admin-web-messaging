import {
  SETUP_ALGOLIA_CLIENT,
} from '../constants/ActionTypes';

const initialState = {
  eventsIndex: null,
  pagesIndex: null,
  usersIndex: null,
  ready: false,
};

export default function algoliaReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SETUP_ALGOLIA_CLIENT:
      return {
        ...state,
        eventsIndex: payload.eventsIndex,
        pagesIndex: payload.pagesIndex,
        usersIndex: payload.usersIndex,
        ready: true,
      };
    default:
      return state;
  }
}
