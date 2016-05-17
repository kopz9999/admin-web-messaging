import React from 'react';
import { render } from 'react-dom';
import { Client, xhr } from 'layer-sdk';
import { LayerProvider } from 'layer-react';
import App from './containers/App';

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
  create({targetNode, challengeCallback}) {
    render(
      <App
        appId={AppId}
        challengeCallback={challengeCallback}
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
    challengeCallback: getIdentityToken
  });
});