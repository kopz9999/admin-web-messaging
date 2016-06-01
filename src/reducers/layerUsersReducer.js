import {
  REQUEST_LAYER_USER,
  RECEIVE_LAYER_USER,
} from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  layerUser: null
};

function layerUser(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_LAYER_USER:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_LAYER_USER:
      return {
        ...state,
        isFetching: false,
        layerUser: payload.layerUser,
      };
    default:
      return state;
  }
}

function layerUsers(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_LAYER_USER:
    case RECEIVE_LAYER_USER:
      return {
        ...state,
        [payload.layerId]: layerUser(state[payload.layerId], action)
      };
    default:
      return state;
  }
}

export default function layerUsersByConversation(state = {}, action) {
  const { payload, type } = action;

  switch (type) {
    case REQUEST_LAYER_USER:
    case RECEIVE_LAYER_USER:
      return {
        ...state,
        [payload.conversationId]: layerUsers(state[payload.conversationId], action)
      };
    default:
      return state
  }
}
