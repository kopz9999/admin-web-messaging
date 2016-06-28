import {
  REQUEST_EVENTS,
  QUERY_EVENTS,
  LOAD_MORE_EVENTS,
  RECEIVE_EVENTS,
  SEARCH_CHANGE,
  SET_EVENTS_TIMEOUT,
  CLEAR_EVENTS_TIMEOUT,
  LOAD_EVENT_MESSAGES,
  CLEAR_EVENTS,
} from '../constants/ActionTypes';
import {
  eventFactoryInstance,
} from '../models/Event';
// Constants
import { MESSAGE, VISIT } from '../constants/EventTypes';

const initialState = {
  isFetching: false,
  eventPagination: 250,
  fromTimestamp: null,
  currentTimeout: null,
  currentSearch: '',
  events: [],
  orderedEvents: [],
  messageEvents: {},
  pendingEvents: {},
  layerMessages: {},
};

export default function timeLineReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SET_EVENTS_TIMEOUT:
      return {
        ...state,
        currentTimeout: payload.currentTimeout
      };
    case CLEAR_EVENTS_TIMEOUT:
      return {
        ...state,
        currentTimeout: null,
      };
    case CLEAR_EVENTS:
      return {
        ...state,
        events: [],
        orderedEvents: [],
        messageEvents: {},
        pendingEvents: {},
        layerMessages: {},
      };
    case REQUEST_EVENTS:
      return {
        ...state,
        isFetching: true,
        fromTimestamp: payload.fromTimestamp
      };
    case RECEIVE_EVENTS:
      let resultEvents = {
        ...state,
        isFetching: false,
        events: payload.events,
      }, noPendingKeys = [],
        mixedArray, pendingEvents = { ...resultEvents.pendingEvents };
      // Check if events are still pending, and map messages
      resultEvents.events.forEach((e)=> {
        if (e.type == MESSAGE && e.message) {
          resultEvents.messageEvents[e.message.id] = e;
          if (resultEvents.pendingEvents[e.message.id]) {
            noPendingKeys.push(e.message.id);
          }
        }
      });
      // Get rid of non pending events
      noPendingKeys.forEach((k)=> {
        delete pendingEvents[k];
      });
      resultEvents.pendingEvents = pendingEvents;
      // Order events
      // TODO: Optimize sorting
      mixedArray = resultEvents.events.map(e => e);
      Object.keys(pendingEvents).forEach((k)=>
        mixedArray.push(pendingEvents[k])
      );
      resultEvents.orderedEvents = mixedArray
        .sort((a,b)=> new Date(b.receivedAt) - new Date(a.receivedAt));
      return resultEvents;
    case LOAD_EVENT_MESSAGES:
      let matchingEvent, resultMessage = { ...state };
      payload.layerMessages.forEach((layerMessage)=>{
        resultMessage.layerMessages[layerMessage.id] = layerMessage;
        if (matchingEvent = resultMessage.messageEvents[layerMessage.id]) {
          matchingEvent.layerMessage = layerMessage;
        } else {
          resultMessage.pendingEvents[layerMessage.id] =
            eventFactoryInstance.buildFromLayerMessage(layerMessage);
        }
      });
      return resultMessage;
    case LOAD_MORE_EVENTS:
      return {
        ...state,
        eventPagination: state.eventPagination + 50
      };
    case SEARCH_CHANGE:
      return {
        ...state,
        currentSearch: payload.currentSearch
      };
    default:
      return state;
  }
}
