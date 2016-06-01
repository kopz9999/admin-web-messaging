import {
  REQUEST_CONVERSATIONS_USERS,
  RECEIVE_CONVERSATIONS_USERS
} from '../constants/ActionTypes';
import {
  loadParticipants,
} from './conversationActions';

function requestParticipants() {
  return {
    type: REQUEST_CONVERSATIONS_USERS,
  }
}

function receiveParticipants() {
  return {
    type: RECEIVE_CONVERSATIONS_USERS,
  }
}
export function loadConversations(conversations) {
  return (dispatch) => {
    let promises = null;
    dispatch( requestParticipants() );
    promises = conversations.map((conversation) =>
      dispatch(loadParticipants(conversation)));
    return Promise.all(promises).then(()=> {
      return dispatch(receiveParticipants())
    });
  }
}
