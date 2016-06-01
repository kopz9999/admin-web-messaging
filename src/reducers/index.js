import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import appReducer from './appReducer';
import activeConversationReducer from './activeConversationReducer';
import newConversationReducer from './newConversationReducer';
import loginReducer from './loginReducer';
import usersReducer from './usersReducer';
import layerUsersReducer from './layerUsersReducer';
import conversationListReducer from './conversationListReducer';

const rootReducer = combineReducers({
  app: appReducer,
  router: routerStateReducer,
  activeConversation: activeConversationReducer,
  newConversation: newConversationReducer,
  login: loginReducer,
  users: usersReducer,
  layerUsers: layerUsersReducer,
  conversationList: conversationListReducer,
});

export default rootReducer;
