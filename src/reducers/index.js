import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import appReducer from './appReducer';
import activeConversationReducer from './activeConversationReducer';
import authReducer from './authReducer';
import usersReducer from './usersReducer';
import layerUsersReducer from './layerUsersReducer';
import conversationListReducer from './conversationListReducer';
import settingsReducer from './settingsReducer';
import layerClientReducer from './layerClientReducer';
import algoliaReducer from './algoliaReducer';
import timeLineReducer from './timeLineReducer';
import pagesReducer from './pagesReducer';

const rootReducer = combineReducers({
  app: appReducer,
  router: routerStateReducer,
  activeConversation: activeConversationReducer,
  auth: authReducer,
  users: usersReducer,
  layerUsers: layerUsersReducer,
  pages: pagesReducer,
  conversationList: conversationListReducer,
  settings: settingsReducer,
  layerClient: layerClientReducer,
  algolia: algoliaReducer,
  timeLine: timeLineReducer,
});

export default rootReducer;
