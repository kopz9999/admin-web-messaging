// Layer
import { TypingIndicators } from 'layer-sdk';
import { xhr, Client } from 'layer-sdk';
// App
import {
  CLIENT_READY,
  CLIENT_RESET,
  CREATE_USER_CLIENT,
  REQUEST_CONVERSATION_JOIN,
  RECEIVE_CONVERSATION_JOIN,
  RESET_CONVERSATION_JOIN,
} from '../constants/ActionTypes';
import {
  userFactoryInstance
} from '../models/User';
import {
  getLayerConversationId
} from '../utils/Helper';
// Other Actions
import {
  receiveLayerUser
} from '../actions/layerUsersActions';
import {
  doConversationCreate,
  doConversationRequest,
  changeComposerMessage,
  submitComposerMessage,
  publishComposerMessage,
} from '../actions/conversationActions';
// Endpoints
import { LAYER_USERS_API } from '../constants/Endpoints';
import { OK, NOT_FOUND } from 'http-status-codes';

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

function createUserClient(client) {
  return {
    type: CREATE_USER_CLIENT,
    payload: {
      client
    }
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

function requestConversationJoin() {
  return {
    type: REQUEST_CONVERSATION_JOIN,
  }
}

function receiveConversationJoin() {
  return {
    type: RECEIVE_CONVERSATION_JOIN,
  }
}

export function resetConversationJoin() {
  return {
    type: RESET_CONVERSATION_JOIN,
  }
}

/*
* TODO: Keep listening if the user started a conversation
* */
export function joinConversation(layerId) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    dispatch(requestConversationJoin());
    return fetch(`${LAYER_USERS_API}/${layerId}/conversations`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      })
      .then(response => {
        if (response.status === OK) {
          return response.json()
            .then((conversations)=>
              dispatch(
                (conversations.length > 0) ?
                  doConversationRequest(conversations[0].id) :
                  doConversationCreate(layerId)
              )
            )
        } else if (response.status === NOT_FOUND) {
          return dispatch(doConversationCreate(layerId))
        } else {
          return Promise.reject(response.status);
        }
      })
      .then(()=> dispatch(receiveConversationJoin()))
  };
}

export function initUserLayerClient() {
  return (dispatch, getState) => {
    const state = getState();
    const { appId } = state.settings;
    const { layerId } = state.app.currentUser;
    let client = new Client({appId: appId });
    dispatch(createUserClient(client));
    client.once('challenge', e => {
      getIdentityToken(layerId, state, e.nonce, e.callback);
    });
    return new Promise((resolve)=> {
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
    dispatch(publishComposerMessage(currentUserLayerId, consumerUserLayerId, message));

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
