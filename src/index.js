// React
import React from 'react';
import { render } from 'react-dom';
// Layer
import { Client, xhr } from 'layer-websdk';
import { LayerProvider } from 'layer-react';
// App
import App from './containers/App';
import configureStore from './store/configureStore';
import { loginSuccess } from './actions/authActions';

class AdminApp {
  create({targetNode}) {
    const store = configureStore();
    let token = localStorage.getItem('token');
    if (token !== null) store.dispatch(loginSuccess(token));

    render(
      <App store={store} />,
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
  });
});