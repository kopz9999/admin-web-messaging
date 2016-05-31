import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { IndexRoute, Route } from 'react-router';
import { ReduxRouter } from 'redux-router';
// Layer
import { LayerProvider } from 'layer-react';
import { Client } from 'layer-sdk';
// App Components
import Wrapper from './timeline/Wrapper';
import Website from './timeline/Website';
import SignIn from './login/SignIn';
import Conversation from './timeline/Conversation';

// App Store
import configureStore from '../store/configureStore';

export default class App extends Component {
  render() {
    const { appId, challengeCallback } = this.props;
    const client = new Client({appId: appId });
    const store = configureStore(client);

    // TODO: Replace with token when session has been initialized
    client.once('challenge', e => {
      challengeCallback(e.nonce, e.callback);
    });

    return (
      <LayerProvider client={client}>
        <Provider store={store}>
          <ReduxRouter>
            <Route path='/'>
              <IndexRoute component={SignIn}/>
            </Route>
            <Route path='/home' component={Wrapper}>
              <IndexRoute component={Website}/>
              <Route path='/users/:layerId/conversations/:conversationId'
                     component={Conversation}/>
            </Route>
          </ReduxRouter>
        </Provider>
      </LayerProvider>
    );
  }
}