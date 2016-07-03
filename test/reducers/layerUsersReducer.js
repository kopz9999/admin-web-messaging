import expect from 'expect'
import reducer from '../../src/reducers/layerUsersReducer'
import * as types from '../../src/constants/ActionTypes'
import { User, userFactoryInstance } from '../../src/models/User'

describe('reducers', ()=> {
    describe('layerUsers', () => {
      it('should return the initial state', () => {
        expect(
          reducer(undefined, {})
        ).toEqual({})
      })
    
      it('should handle REQUEST_LAYER_USER', () => {
        expect(
          reducer({}, {
            type: types.REQUEST_LAYER_USER,
            payload: {
                layerId: "123",
            }
          })
        ).toEqual({
            "123": { isFetching: true, layerUser: null }
        })
      })
      
      it('should handle RECEIVE_LAYER_USER', () => {
        const testLayerUser = 
            userFactoryInstance.buildUnknownUser({ layerId: '123' });
            
        expect(
          reducer({
            "123": { isFetching: true }
          }, {
            type: types.RECEIVE_LAYER_USER,
            payload: {
                layerId: '123',
                layerUser: testLayerUser
            }
          })
        ).toEqual({
            "123": { isFetching: false, layerUser: testLayerUser }
        })
    
      })
    });    
});
