// Libs
import algoliasearch from 'algoliasearch';
import {
  SETUP_ALGOLIA_CLIENT,
} from '../constants/ActionTypes';

export function setupAlgoliaClient(appId, key) {
  const algoliaClient = algoliasearch(appId, key);
  const eventsIndex = algoliaClient.initIndex('events_log');
  const pagesIndex = algoliaClient.initIndex('pages');
  const usersIndex = algoliaClient.initIndex('users');

  return {
    type: SETUP_ALGOLIA_CLIENT,
    payload: {
      eventsIndex,
      pagesIndex,
      usersIndex,
    }
  };
}
