// var jsdom = require('mocha-jsdom')
// import { expect } from 'chai'
// import 'jsdom-global/register'
import expect from 'expect'
import nock from 'nock'
import mochaLet from 'mocha-let';
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store';
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
// App
import * as actions from '../../src/actions/conversationActions'
import * as layerClientActions from '../../src/actions/layerClientActions'
import * as types from '../../src/constants/ActionTypes'
import { User } from '../../src/models/User'
import configureStore from '../../src/store/configureStore';

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
    });
    
    describe('doConversationRequest()', ()=> {
      afterEach(() => {
        nock.cleanAll()
      })
      mochaLet('conversationId', 'b07cc039-6da4-4e12-89fd-1a038fa7d559');
      mochaLet('layerAPIHost', 'https://api.layer.com');
      mochaLet('identityProviderHost', 
        'https://layer-identity-provider.herokuapp.com');
      mochaLet('identityProviderPath', 
        '/identity_tokens');
      mochaLet('identityProviderURL', function(){
        return this.identityProviderHost + this.identityProviderPath;
      });
      
      mochaLet('currentStore', function() {
        return configureStore();
        /*
        return mockStore({ 
          settings: {
            identityProviderURL: this.identityProviderURL
          },
          app: {
            currentUser: new User({
              id: 1, 
              layerId: '1', 
              displayName: 'test', 
              iconIdentity: 0
            })
          }
        });
        */
      });
      

      it.only('should request the conversation again when not loaded correctly', function(done) {
        this.timeout(15000);
        var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImN0eSI6ImxheWVyLWVpdDt2PTEiLCJraWQiOiI1MmZlMDMyOC1lOWNiLTExZTUtYTE4OC03ZDRlZDcxMzY2ZTgifQ.eyJpc3MiOiI1MmU2NmQ4YS1lOWNiLTExZTUtYTE4OC03ZDRlZDcxMzY2ZTgiLCJwcm4iOiIyIiwiaWF0IjoxNDY4MDI2Njg3LCJleHAiOjE0NjkyMzYyODcsIm5jZSI6IkxfQWxiNGxYeEE1TGx0MlZYMGpZLVVnd1M0cW9JOE9XTEZyY1VJWkdySjltVzNKdk1BQzFMQ3ZRaW5uekpQTEh1MEJVdFhCbnhIZl82d2J4dmRMUDdRIiwiZGlzcGxheV9uYW1lIjpudWxsLCJhdmF0YXJfdXJsIjoiIn0.oaj9TQGH1xuvHbVStZbK01IdZWtVyUM_qNJsVkNQ8ke1Q9vNFKoWysaz00Sa7EpufrLyNTYSBHl_2-zwpNN1jw"
        const { conversationId } = this;
        
        nock(this.identityProviderHost)
          .post(this.identityProviderPath)
          .reply(200, { 
            "identity_token": token
          });

        nock(this.layerAPIHost)
          .post('/nonces')
          .reply(201, {"nonce":"L_Alb4lXxA5Llt2VX0jY-UgwS4qoI8OWLFrcUIZGrJ9mW3JvMAC1LCvQinnzJPLHu0BUtXBnxHf_6wbxvdLP7Q"});
          
        nock(this.layerAPIHost)
          .post('/sessions')
          .reply(201, {
            "session_token":"Xc3Wb5a5576kCC1blGeRRANCcubis9U-r-elL33tEjm9s8b6FskEsd1bgYhfuQH467vKeWC_q9X-YDXVkDF8yg.8-6"
          });
          
        nock(this.layerAPIHost)
          .post('/conversations/'+conversationId)
          .reply(200, 
            {
              "id":"layer:///conversations/b07cc039-6da4-4e12-89fd-1a038fa7d559",
              "url":"https://api.layer.com/conversations/b07cc039-6da4-4e12-89fd-1a038fa7d559",
              "messages_url":"https://api.layer.com/conversations/b07cc039-6da4-4e12-89fd-1a038fa7d559/messages",
              "created_at":"2016-07-08T20:20:41.383Z",
              "last_message": {
                "id":"layer:///messages/548f538b-8ad3-4510-bedd-1156f2fee47f",
                "url":"https://api.layer.com/messages/548f538b-8ad3-4510-bedd-1156f2fee47f",
                "receipts_url":"https://api.layer.com/messages/548f538b-8ad3-4510-bedd-1156f2fee47f/receipts",
                "position":67405086720,
                "conversation":{"id":"layer:///conversations/b07cc039-6da4-4e12-89fd-1a038fa7d559","url":"https://api.layer.com/conversations/b07cc039-6da4-4e12-89fd-1a038fa7d559"},
                "parts":[{"id":"layer:///messages/548f538b-8ad3-4510-bedd-1156f2fee47f/parts/0","mime_type":"text/plain","body":"test king","encoding":null,"content":null}],
                "sent_at":"2016-07-08T21:32:52.961Z","received_at":"2016-07-08T21:32:53.267Z",
                "sender":{"id":"layer:///identities/visitor%7Ccuraytor.com_1468009224866","url":"https://api.layer.com/identities/visitor%7Ccuraytor.com_1468009224866","user_id":"visitor|curaytor.com_1468009224866","name":null,"display_name":null,"avatar_url":null},
                "is_unread":false,
                "recipient_status":{"Customer Support":"sent","2":"read","visitor|curaytor.com_1468009224866":"read"},
                "notification":null
              },
              "participants":["Customer Support","2","visitor|curaytor.com_1468009224866"],"distinct":true,"unread_message_count":0,
              "metadata":{"appParticipants":{"2":{"layerId":"2","displayName":"Jana Matic","color":"#a5b0bb","id":"2","avatarURL":"//res.cloudinary.com/curaytor/image/upload/c_thumb,h_108,w_108/gpbbqxcpnbk9yttqfghl"},"1":{"displayName":"Guest 1468009224866","color":"#d8bb5b","layerId":"visitor|curaytor.com_1468009224866","iconIdentity":"4"},"0":{"layerId":"Customer Support","iconIdentity":"4","displayName":"Sarah Mailloux","roleName":"","color":"#c4833e","avatarURL":"http://res.cloudinary.com/curaytor/image/upload/c_thumb,h_108,w_108/uvjy6f0dndvqvv6ri8u2.jpg"}}}
            }
          );
          
          
        this.currentStore.dispatch(layerClientActions.initUserLayerClient(process.env.LAYER_APP_ID))
          .then(() => { // return of async actions
            console.log(this.currentStore);
            this.currentStore.dispatch(actions.doConversationRequest(conversationId)).then(()=>{
              done();
            });
            // 
            // expect(store.getActions()).toEqual(expectedActions)
            // this.currentStore.dispatch(actions.doConversationRequest());
          });
          
      });
    });
    
    
    
  });  
});
