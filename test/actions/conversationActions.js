import expect from 'expect'
import * as actions from '../../src/actions/conversationActions'
import * as types from '../../src/constants/ActionTypes'

describe('actions', ()=> {
  describe('conversation', () => {
    it('should create an action to set a conversation', () => {
      const conversationId = 'ab4e107d-097e-4d5e-a8f8-2b0f60bcc8e9'
      const expectedAction = {
        type: types.SET_CONVERSATION,
        payload: {
          conversationId
        }
      }
      expect(actions.setConversation(conversationId)).toEqual(expectedAction);
    })
  });  
});
