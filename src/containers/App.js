import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { IndexRoute, Route } from 'react-router';
import { ReduxRouter } from 'redux-router';
// Layer
import { LayerProvider } from 'layer-react';
import { Client } from 'layer-sdk';
// App Components
import Wrapper from './timeline/Wrapper';
import ConversationListWrapper from './timeline/ConversationListWrapper';
import SignIn from './login/SignIn';
import ConversationWrapper from './timeline/ConversationWrapper';

// App Store
import configureStore from '../store/configureStore';

export default class App extends Component {
  render() {
    const store = configureStore();

    return (
      <Provider store={store}>
        <ReduxRouter>
          <Route path='/'>
            <IndexRoute component={SignIn}/>
          </Route>
          <Route path='/home' component={Wrapper}>
            <IndexRoute component={ConversationListWrapper}/>
            <Route path='/users/:layerId/conversations/:conversationId'
                   component={ConversationWrapper}/>
          </Route>
        </ReduxRouter>
      </Provider>
    );
  }
}