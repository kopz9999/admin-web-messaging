import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import appReducer from './appReducer';
import activeConversationReducer from './activeConversationReducer';
import newConversationReducer from './newConversationReducer';
import loginReducer from './loginReducer';
import timeLineReducer from './timeLineReducer';
import pagesReducer from './pagesReducer';
import sitesReducer from './sitesReducer';
import usersReducer from './usersReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  app: appReducer,
  router: routerStateReducer,
  activeConversation: activeConversationReducer,
  newConversation: newConversationReducer,
  login: loginReducer,
  timeLine: timeLineReducer,
  settings: settingsReducer,
  pages: pagesReducer,
  sites: sitesReducer,
  users: usersReducer,
});

export default rootReducer;
