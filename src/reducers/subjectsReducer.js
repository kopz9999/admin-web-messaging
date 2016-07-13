import {
  REMOVE_SUBJECT,
  RECEIVE_SUBJECT,
  SET_SUBJECTS,
} from '../constants/ActionTypes';

const initialState = {};

export default function layerUsers(state = {}, action) {
  let newState = null;
  const { payload, type } = action;

  switch (type) {
    case SET_SUBJECTS:
      newState = { ...state };
      let subjects = payload.subjects;
      subjects.forEach((user)=>{
        newState[user.layerId] = user;
      });
      return newState;
    case REMOVE_SUBJECT:
      newState = { ...state };
      delete newState[payload.layerId];
      return newState;
    case RECEIVE_SUBJECT:
      return {
        ...state,
        [payload.layerId]: payload.subject
      };
    default:
      return state;
  }
}
