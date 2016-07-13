import {
  REMOVE_SUBJECT,
  RECEIVE_SUBJECT,
  SET_SUBJECTS,
} from '../constants/ActionTypes';
import { receiveLayerUser } from './layerUsersActions';
import {
  FOLLOW_USERS_API,
} from '../constants/Endpoints';
import {
  userFactoryInstance
} from '../models/User';
// Libs
import fetch from 'isomorphic-fetch';

function removeSubject(subject) {
  subject.isSubject = false;
  return {
    type: REMOVE_SUBJECT,
    payload: {
      layerId: subject.layerId,
    }
  }
}

function receiveSubject(layerId, subject) {
  subject.isSubject = true;
  return {
    type: RECEIVE_SUBJECT,
    payload: {
      layerId,
      subject,
    }
  }
}

function setSubjects(subjects) {
  return {
    type: SET_SUBJECTS,
    payload: {
      subjects,
    }
  }
}

export function processUserSubjects(rawUser) {
  return (dispatch) => {
    let subject;
    let subjects = rawUser.subjects.map((s)=> {
      subject = userFactoryInstance.buildFromMessagingAPI(s);
      subject.isSubject = true;
      return subject;
    });
    dispatch(setSubjects(subjects));
    subjects.forEach((s)=> {
      dispatch(receiveLayerUser(s.layerId, s));
    });
  };
}

export function followUser(user) {
  return (dispatch, getState) => {
    const { layerId } = user;
    const { currentUser } = getState().app;
    const payload = { follower_id: currentUser.layerId };
    dispatch(receiveSubject(layerId, user));
    return fetch(FOLLOW_USERS_API.replace(':layerId', layerId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  };
}

export function unFollowUser(user) {
  return (dispatch, getState) => {
    const { layerId } = user;
    const { currentUser } = getState().app;
    const followUsersAPI = FOLLOW_USERS_API.replace(':layerId', layerId) +
      '/' + currentUser.layerId;
    dispatch(removeSubject(user));
    return fetch(followUsersAPI, {
      method: 'DELETE'
    });
  };
}
