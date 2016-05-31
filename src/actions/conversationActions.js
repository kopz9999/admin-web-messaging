// App
import {
  REQUEST_PARTICIPANTS,
  RECEIVE_PARTICIPANTS,
  REQUEST_CONVERSATION,
  RECEIVE_CONVERSATION,
} from '../constants/ActionTypes';
import {
  verifyFetchUser,
  receiveUser
} from './usersActions';
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
  return (dispatch, getState) => {
    const { appParticipants } = conversation.metadata;
    let state = getState(), participantUser, userState, stateKey;
    if (appParticipants) {
      Object.keys(appParticipants).forEach((k) => {
        participantUser =
          userFactoryInstance.buildFromMetadata(appParticipants[k]);
        stateKey = participantUser.layerId;
        userState = state[stateKey];
        if (userState) {
          if (!userState.user && !userState.isFetching) {
            dispatch(receiveUser(stateKey, participantUser));
          }
        } else {
          dispatch(receiveUser(stateKey, participantUser));
        }
      });
    }
    return dispatch(fetchParticipants(conversation.participants))
  }
}

export function fetchParticipants(participantIds) {
  return (dispatch, getState) => {
    let state = null, participants = null, promises = null;
    dispatch( requestParticipants(participantIds) );
    promises =
      participantIds.map((layerId) => dispatch(verifyFetchUser(layerId)));
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

export function receiveConversation(conversation) {
  return {
    type: RECEIVE_CONVERSATION,
    payload: {
      conversation
    }
  }
}

export function onReceiveConversation(conversation) {
  return (dispatch) => {
    dispatch( receiveConversation(conversation) );
    return dispatch(loadParticipants(conversation));
  }
}