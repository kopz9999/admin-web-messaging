// App
import {
  REQUEST_PARTICIPANTS,
  RECEIVE_PARTICIPANTS,
  REQUEST_CONVERSATION,
  RECEIVE_CONVERSATION,
  CHANGE_COMPOSER_MESSAGE,
  SUBMIT_COMPOSER_MESSAGE,
  SEND_COMPOSER_MESSAGE,
  RECEIVE_COMPOSER_MESSAGE,
} from '../constants/ActionTypes';
import {
  EVENTS_API,
} from '../constants/Endpoints';
import {
  DEFAULT_USER,
} from '../constants/Application';
import {
  verifyFetchLayerUser,
  receiveLayerUser
} from './layerUsersActions';
import { userFactoryInstance } from '../models/User';
import { messageFactoryInstance } from '../models/Message';

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

export function sendComposerMessage() {
  return {
    type: SEND_COMPOSER_MESSAGE
  };
}

export function receiveComposerMessage() {
  return {
    type: RECEIVE_COMPOSER_MESSAGE
  };
}

function buildAlgoliaRequest(layerUsers, currentUserLayerId, consumerUserLayerId,
                             conversationId, message) {
  const conversationUsers = layerUsers[conversationId];
  const currentUser = conversationUsers[currentUserLayerId].layerUser;
  const consumerUser = conversationUsers[consumerUserLayerId].layerUser;
  const userKeys = Object.keys(conversationUsers)
                         .filter( k => k != consumerUserLayerId && k != DEFAULT_USER );

  return {
    user: userFactoryInstance.serializeToAlgolia(consumerUser),
    type: "MESSAGE",
    message: messageFactoryInstance.serializeToAlgolia(message),
    users: userKeys.map((k) =>
      userFactoryInstance.serializeToAlgolia(conversationUsers[k].layerUser)),
    backend_user: userFactoryInstance.serializeToAlgolia(currentUser),
    logged_at: Date.now()
  };
}

export function publishComposerMessage(currentUserLayerId, consumerUserLayerId,
                                       conversationId, message) {
  return (dispatch, getState) => {
    const { layerUsers } = getState();
    dispatch(sendComposerMessage());
    return new Promise((resolve) => {
      message.once('messages:sent', () => {
        const payload = buildAlgoliaRequest(layerUsers, currentUserLayerId,
          consumerUserLayerId, conversationId, message);
        fetch(EVENTS_API, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }).then(() => {
          dispatch(receiveComposerMessage());
          resolve();
        });
      });
    });
  }
}

export function onReceiveConversation(conversation) {
  return (dispatch) => {
    dispatch( receiveConversation(conversation) );
    return dispatch(loadParticipants(conversation));
  }
}

export function doConversationRequest(conversationId) {
  return (dispatch, getState) => {
    const { client } = getState().layerClient;
    const searchedConversation = client.getConversation(conversationId,
      true);
    dispatch(requestConversation(conversationId));
    return new Promise((resolve)=> {
      searchedConversation.on('conversations:loaded', () => {
        dispatch(receiveConversation());
        dispatch(
          loadParticipants(searchedConversation)
        ).then(() => { resolve() });
      });
    });
  };
}
