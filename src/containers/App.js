import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { IndexRoute, Route } from 'react-router';
import { ReduxRouter } from 'redux-router';
// Layer
import { LayerProvider } from 'layer-react';
import { Client } from 'layer-sdk';
// App Components
import Wrapper from './timeline/Wrapper';
import Global from './timeline/Global';
import SignIn from './login/SignIn';
import ConversationWrapper from './timeline/ConversationWrapper';
import Logout from '../components/Logout';

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
            <IndexRoute component={Global}/>
            <Route path='/users/:layerId/conversations/:conversationId'
                   component={ConversationWrapper}/>
            <Route path='/logout' component={Logout} />
          </Route>
        </ReduxRouter>
      </Provider>
    );
  }
}