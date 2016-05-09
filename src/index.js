import React from 'react';
import { render } from 'react-dom';
import { Client } from 'layer-sdk';
import { LayerProvider } from 'layer-react';
import App from './containers/App';

const AppId = 'layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8';

class AdminApp {
  create({targetNode}) {
    render(
      <App
        appId={AppId}
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
  AdminApp.current.create({ targetNode: document.getElementById('root') })
});