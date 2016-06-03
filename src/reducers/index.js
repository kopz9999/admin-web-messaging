import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import appReducer from './appReducer';
import activeConversationReducer from './activeConversationReducer';
import newConversationReducer from './newConversationReducer';
import loginReducer from './loginReducer';
import usersReducer from './usersReducer';
import layerUsersReducer from './layerUsersReducer';
import conversationListReducer from './conversationListReducer';
import settingsReducer from './settingsReducer';
import layerClientReducer from './layerClientReducer';

const rootReducer = combineReducers({
  app: appReducer,
  router: routerStateReducer,
  activeConversation: activeConversationReducer,
  newConversation: newConversationReducer,
  login: loginReducer,
  users: usersReducer,
  layerUsers: layerUsersReducer,
  conversationList: conversationListReducer,
  settings: settingsReducer,
  layerClient: layerClientReducer,
});

export default rootReducer;
