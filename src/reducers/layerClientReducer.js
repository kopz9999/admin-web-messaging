import {
  CLIENT_READY,
  CLIENT_RESET,
  CREATE_USER_CLIENT,
  REQUEST_CONVERSATION_JOIN,
  RECEIVE_CONVERSATION_JOIN,
  RESET_CONVERSATION_JOIN,
} from '../constants/ActionTypes';

const initialState = {
  clientReady: false,
  client: null,
  joiningConversation: false,
  joinedConversation: false,
};

export default function layerClientReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case CREATE_USER_CLIENT:
      return {
        ...state,
        client: payload.client,
      };
    case CLIENT_RESET:
      return {
        ...state,
        clientReady: false,
      };
    case CLIENT_READY:
      return {
        ...state,
        clientReady: true,
      };
    case REQUEST_CONVERSATION_JOIN:
      return {
        ...state,
        joiningConversation: true,
        joinedConversation: false,
      };
    case RECEIVE_CONVERSATION_JOIN:
      return {
        ...state,
        joiningConversation: false,
        joinedConversation: true,
      };
    case RESET_CONVERSATION_JOIN:
      return {
        ...state,
        joiningConversation: false,
        joinedConversation: false,
      };
    default:
      return state;
  }
}
