import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../src/actions/authActions'
import * as types from '../../src/constants/ActionTypes'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('actions', ()=>{
  describe('auth', () => {
    afterEach(() => {
      nock.cleanAll()
    })
  
    it('does LOGIN_SUCCESS with right credentials', () => {
      const token = "secret";
      nock('https://api.curaytor.com/')
        .post('/auth/user_token')
        .reply(200, { 
          "jwt": token
        })
  
      const expectedActions = [
        { type: types.REQUEST_ACCESS },
        { 
          type: types.LOGIN_SUCCESS,
          payload: {
            token
          }        
        },
        {
          "payload": {
            "args": [null, "/home"],
            "method": "pushState"
          },
          "type": "@@reduxReactRouter/historyAPI"
        }
      ]
      const store = mockStore({ auth: [] })
  
      return store.dispatch(actions.doLogin('user', 'password'))
        .then(() => { // return of async actions
          expect(store.getActions()).toEqual(expectedActions)
        })
    })    
  });
});
