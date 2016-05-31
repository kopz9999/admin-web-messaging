import React from 'react';
import { render } from 'react-dom';
import { Client, xhr } from 'layer-sdk';
import { LayerProvider } from 'layer-react';
// App
import App from './containers/App';
import configureStore from './store/configureStore';
// Actions
import { receiveUser } from './actions/usersActions';
// Models
import { User } from './models/User';

// TODO: Remove and integrate with login and session functionality
const AppId = 'layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8';
const CustomerAppId = 'Customer Support';
const identityProviderURL = 'https://layer-identity-provider.herokuapp.com/identity_tokens';
function getIdentityToken(nonce, callback){
  xhr({
    url: identityProviderURL,
    headers: {
      'X_LAYER_APP_ID': AppId,
      'Content-type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    data: {
      nonce: nonce,
      app_id: AppId,
      user_id: CustomerAppId
    }
  }, function(res) {
    if (res.success) {
      console.log('challenge: ok');
      callback(res.data.identity_token);
    } else {
      console.error('challenge error: ', res.data);
    }
  });
}

class AdminApp {
  get client() {
    return this._client;
  }

  get store() {
    return this._store;
  }

  initializeClient(appId, challengeCallback) {
    const client = new Client({appId: appId });
    // TODO: Replace with token when session has been initialized
    client.once('challenge', e => {
      challengeCallback(e.nonce, e.callback);
    });
    this._client = client;
  }

  initializeStore() {
    this._store = configureStore(this.client);
  }

  loadSettings() {
    let users;
    const settings = this.store.getState().settings;
    if (settings.bootstrapUsers) {
      users = [];
      users.push(
        new User({
          id: 1,
          displayName: 'Margaret Bell',
          layerId: 'Customer Support',
          avatarURL: 'https://s3-us-west-2.amazonaws.com/kopz-projects/Curaytor/Messenger/admin-avatar.png'
        })
      );
      users.push(
        new User({
          id: 2,
          displayName: 'Customer',
          layerId: 'Customer',
          color: '#ffae2e'
        })
      );
      users.push(
        new User({
          id: 3,
          displayName: 'Jana',
          layerId: 'visitor|jana@curaytor.com',
          color: '#ffae2e'
        })
      );
      users.forEach((u)=>{
        this.store.dispatch( receiveUser(u.layerId, u) );
      });
    }
  }

  create({targetNode, appId, challengeCallback}) {
    this.initializeClient(appId, challengeCallback);
    this.initializeStore();
    this.loadSettings();

    render(
      <App
        client={this.client}
        store={this.store}
      />,
      targetNode
    );
  }

  static get current() {
    if (!AdminApp._current) AdminApp._current = new AdminApp();
    return AdminApp._current;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  AdminApp.current.create({
    targetNode: document.getElementById('root'),
    challengeCallback: getIdentityToken,
    appId: AppId
  });
});