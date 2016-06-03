import {
  CLIENT_READY,
  CLIENT_RESET
} from '../constants/ActionTypes';

const initialState = {
  clientReady: false,
};

export default function layerClientReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
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
    default:
      return state;
  }
}
