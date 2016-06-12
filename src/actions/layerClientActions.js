// Layer
import { TypingIndicators } from 'layer-sdk';
import { xhr, Client } from 'layer-sdk';
// App
import {
  CLIENT_READY,
  CLIENT_RESET,
} from '../constants/ActionTypes';
import {
  userFactoryInstance
} from '../models/User';
// Other Actions
import {
  receiveLayerUser
} from '../actions/layerUsersActions';
import {
  requestConversation,
  receiveConversation,
  loadParticipants,
  changeComposerMessage,
  submitComposerMessage,
  publishComposerMessage,
} from '../actions/conversationActions';

const {
  STARTED,
  FINISHED
} = TypingIndicators;

export function clientReset() {
  return {
    type: CLIENT_RESET
  };
}

function clientReady() {
  return {
    type: CLIENT_READY
  };
}

/*
 NOTE: Layer clients will work only with tokens from a lightweight backend
 Remove this
 * */
function getIdentityToken(userId, state, nonce, callback){
  const { appId, identityProviderURL } = state.settings;
  xhr({
    url: identityProviderURL,
    headers: {
      'X_LAYER_APP_ID': appId,
      'Content-type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    data: {
      nonce: nonce,
      app_id: appId,
      user_id: userId
    }
  }, function(res) {
    if (res.success) {
      console.log(`${userId} challenge: ok`);
      callback(res.data.identity_token);
    } else {
      console.error('challenge error: ', res.data);
    }
  });
}

// Update conversation
function addParticipantToConversation(conversation, currentUser) {
  return (dispatch, getState) => {
    const userId = currentUser.id.toString();
    const results = conversation.participants
      .filter((uid)=> uid.toString() == userId);
    if (results.length > 0) {
      return Promise.resolve();
    } else {
      const { appParticipants } = conversation.metadata;
      let metaData = {}, maxIndex, idx = 0;
      Object.keys(appParticipants).forEach((i) => {
        idx = i;
        metaData[`appParticipants.${i}`] = appParticipants[i];
      });
      maxIndex = parseInt(idx) + 1;
      metaData[`appParticipants.${maxIndex}`] =
        userFactoryInstance.serializeToJSON(currentUser);
      conversation.setMetadataProperties(metaData);
      conversation.addParticipants([userId]);
      dispatch(receiveLayerUser(conversation.id, userId, currentUser));
      return new Promise((resolve) => {
        conversation.on('conversations:change', (e) => {
          const changes = e.changes.filter((c) => c.property == 'participants');
          if (changes.length > 0) {
            // TODO: REMOVE and find why!!
            setTimeout(() => { resolve() }, 2000);
            conversation.off('conversations:change');
          }
        });
      });
    }
  };
}

export function processConversationForUser(currentUser, conversationId) {
  return (dispatch, getState) => {
    const state = getState();
    const { appId, defaultLayerId } = state.settings;
    const client = new Client({appId: appId });
    return new Promise((resolve)=> {
      client.once('challenge', e => {
        getIdentityToken(defaultLayerId, state, e.nonce, e.callback);
      });
      client.on('ready', () => {
        const searchedConversation = client.getConversation(conversationId,
          true);
        dispatch(requestConversation(conversationId));
        searchedConversation.on('conversations:loaded', () => {
          dispatch(receiveConversation());
          return dispatch(
            addParticipantToConversation(searchedConversation, currentUser)
          ).then(() => {
            return dispatch(
              loadParticipants(searchedConversation)
            ).then( () => { resolve() });
          });
        });
      });
    });
  };
}

export function fetchUserLayerClient(client, userId) {
  return (dispatch, getState) => {
    const state = getState();
    return new Promise((resolve)=> {
      client.once('challenge', e => {
         getIdentityToken(userId, state, e.nonce, e.callback);
      });
      client.on('ready', () => {
        dispatch(clientReady());
        resolve();
      });
    });
  };
}

export function submitLayerMessage(layerClient, typingPublisher,
                                   currentUserLayerId, consumerUserLayerId,
                                   conversationId) {
  return (dispatch, getState) => {
    const state = getState();
    const message =
      layerClient
        .getConversation(conversationId, true)
        .createMessage(state.activeConversation.composerMessage).send();
    dispatch(submitComposerMessage());
    dispatch(publishComposerMessage(currentUserLayerId, consumerUserLayerId,
      conversationId, message));

    typingPublisher.setState(FINISHED);

    return Promise.resolve();
  };
}

export function changeLayerMessage(value, typingPublisher, conversationId) {
  return (dispatch, getState) => {
    const state = getState();
    const composerMessage = state.activeConversation.composerMessage;
    const typingState = composerMessage.length > 0 ? STARTED : FINISHED;
    dispatch(changeComposerMessage(value));

    if (!typingPublisher.conversation || typingPublisher.conversation.id !== conversationId) {
      typingPublisher.setConversation({ id: conversationId });
    }
    typingPublisher.setState(typingState);

    return Promise.resolve();
  };
}

export function markMessageRead(layerClient, messageId) {
  return () => {
    layerClient.getMessage(messageId).isRead = true;
    return Promise.resolve();
  }
}
