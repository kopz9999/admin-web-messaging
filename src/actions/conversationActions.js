// App
import {
  REQUEST_PARTICIPANTS,
  RECEIVE_PARTICIPANTS,
  REQUEST_CONVERSATION,
  RECEIVE_CONVERSATION,
  CHANGE_COMPOSER_MESSAGE,
  SUBMIT_COMPOSER_MESSAGE,
} from '../constants/ActionTypes';
import {
  verifyFetchLayerUser,
  receiveLayerUser
} from './layerUsersActions';
import { userFactoryInstance } from '../models/User';

function requestParticipants(participantIds) {
  return {
    type: REQUEST_PARTICIPANTS,
    payload: {
      participantIds
    }
  }
}

function receiveParticipants(participants) {
  return {
    type: RECEIVE_PARTICIPANTS,
    payload: {
      participants
    }
  }
}

export function loadParticipants(conversation) {
  return (dispatch) => {
    let participantUser = null;
    const { appParticipants } = conversation.metadata;
    if (appParticipants) {
      Object.keys(appParticipants).forEach((k) => {
        participantUser =
          userFactoryInstance.buildFromMetadata(appParticipants[k]);
        dispatch(receiveLayerUser(conversation.id, participantUser.layerId,
          participantUser));
      });
    }
    return dispatch(fetchParticipants(conversation.id,
      conversation.participants))
  }
}

export function fetchParticipants(conversationId, participantIds) {
  return (dispatch, getState) => {
    let state = null, participants = null, promises = null;
    dispatch( requestParticipants(participantIds) );
    promises =
      participantIds.map((layerId) =>
        dispatch(verifyFetchLayerUser(conversationId, layerId)));
    return Promise.all(promises).then(()=> {
      state = getState();
      participants = participantIds.map((layerId) => state.users[layerId]);
      return dispatch(receiveParticipants(participants))
    });
  }
}

export function requestConversation(conversationId) {
  return {
    type: REQUEST_CONVERSATION,
    payload: {
      conversationId
    }
  }
}

export function receiveConversation() {
  return {
    type: RECEIVE_CONVERSATION,
  }
}

export function changeComposerMessage(value) {
  return {
    type: CHANGE_COMPOSER_MESSAGE,
    payload: {
      value
    }
  };
}

export function submitComposerMessage() {
  return {
    type: SUBMIT_COMPOSER_MESSAGE
  };
}

export function onReceiveConversation(conversation) {
  return (dispatch) => {
    dispatch( receiveConversation(conversation) );
    return dispatch(loadParticipants(conversation));
  }
}