// Lib
import { QueryBuilder } from 'layer-sdk';
// App
import {
  REQUEST_PARTICIPANTS,
  RECEIVE_PARTICIPANTS,
  REQUEST_CONVERSATION,
  SET_CONVERSATION,
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
  getLayerUser,
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

function registerLayerUser(dispatch, state, rawUser) {
  const { layerId } = rawUser;
  let user = getLayerUser(state, layerId);
  if (user == null) {
    user = userFactoryInstance.buildFromMetadata(rawUser);
    dispatch(receiveLayerUser( layerId, user));
  }
  return user;
}

function readParticipants(conversation) {
  return (dispatch, getState) => {
    const { appParticipants } = conversation.metadata;
    const state = getState();
    if (appParticipants) {
      Object.keys(appParticipants).forEach((k) => {
        registerLayerUser(dispatch, state, appParticipants[k]);
      });
    }
    return Promise.resolve();
  }
}

export function loadParticipants(conversation) {
  return (dispatch) => {
    return dispatch(readParticipants(conversation)).then(()=>
      dispatch(
        fetchParticipants(conversation.id, conversation.participants)
      )
    );
  }
}

export function fetchParticipants(conversationId, participantIds) {
  return (dispatch, getState) => {
    let state = null, participants = null, promises = null;
    dispatch( requestParticipants(participantIds) );
    promises =
      participantIds.map((layerId) =>
        dispatch(verifyFetchLayerUser(layerId)));
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

export function setConversation(conversationId) {
  return {
    type: SET_CONVERSATION,
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

/*
 * TODO: Get site and page from event
 * */
function buildAlgoliaRequest(layerUsers, currentUserLayerId,
                             consumerUserLayerId, message) {
  const currentUser = layerUsers[currentUserLayerId].layerUser;
  const consumerUser = layerUsers[consumerUserLayerId].layerUser;
  const userKeys = Object.keys(layerUsers)
                         .filter( k => k != consumerUserLayerId && k != DEFAULT_USER );

  return {
    user: userFactoryInstance.serializeToAlgolia(consumerUser),
    type: "MESSAGE",
    site: {
      domain: "curaytor.com",
    },
    message: messageFactoryInstance.serializeToAlgolia(message),
    users: userKeys.map((k) =>
      userFactoryInstance.serializeToAlgolia(layerUsers[k].layerUser)),
    backend_user: userFactoryInstance.serializeToAlgolia(currentUser),
    logged_at: Date.now()
  };
}

export function publishComposerMessage(currentUserLayerId, consumerUserLayerId,
                                       message) {
  return (dispatch, getState) => {
    const { layerUsers } = getState();
    dispatch(sendComposerMessage());
    return new Promise((resolve) => {
      message.once('messages:sent', () => {
        const payload = buildAlgoliaRequest(layerUsers, currentUserLayerId,
          consumerUserLayerId, message);
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

function handleConversationChange(e, conversation) {
  return (dispatch) => {
    if (e.changes) {
      e.changes.forEach((change)=> {
        switch (change.property) {
          case "metadata":
            dispatch(readParticipants(conversation));
            break;
          case "id":
            dispatch(setConversation(change.newValue));
            break;
        }
      });
    }
    return Promise.resolve();
  }
}

function createMetadata(participants) {
  let metaData = {};
  participants.forEach((p, i)=> {
    metaData[`appParticipants.${i}`] = userFactoryInstance.serializeToJSON(p);
  });
  return metaData;
}

export function doConversationCreate(layerId) {
  return (dispatch, getState) => (
    dispatch(verifyFetchLayerUser(layerId)).then(()=> {
      const state = getState();
      const { client } = state.layerClient;
      const { defaultLayerId } = state.settings;
      const consumerUser = state.layerUsers[layerId].layerUser;
      const currentUser = state.app.currentUser;
      const expectedConversation = client.createConversation({
        true,
        participants: [ layerId, defaultLayerId ]
      });
      expectedConversation.setMetadataProperties(createMetadata([currentUser,
        consumerUser]));
      expectedConversation.on('conversations:change',
        (e)=> dispatch(handleConversationChange(e, expectedConversation)));
      dispatch(setConversation(expectedConversation.id));
      return dispatch(loadParticipants(expectedConversation));
    })
  )
}

export function doConversationRequest(conversationId) {
  return (dispatch, getState) => {
    const { client } = getState().layerClient;
    const searchedConversation = client.getConversation(conversationId,
      true);
    dispatch(requestConversation(conversationId));
    searchedConversation.on('conversations:change',
      (e)=> dispatch(handleConversationChange(e, searchedConversation)));
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

/* TODO: Implement query for conversation messages */
export function setConversationQuery(conversationId) {
  return (dispatch, getState) => {
    const { client } = getState().layerClient;
    const qBuilder = QueryBuilder
      .messages()
      .forConversation(conversationId);
    let query = client.createQuery(qBuilder);
    query.on('change', function(evt) {

    });
  };
}