import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { IndexRoute, Route } from 'react-router';
import { ReduxRouter } from 'redux-router';
// Layer
import { LayerProvider } from 'layer-react';
import { Client } from 'layer-websdk';
// App Components
import Wrapper from './timeline/Wrapper';
import Global from './timeline/Global';
import PageScope from './timeline/PageScope';
import SignIn from './login/SignIn';
import ConversationWrapper from './timeline/ConversationWrapper';
import {requireAuthentication} from '../utils/AuthenticatedComponent';

export default class App extends Component {
  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <ReduxRouter>
          <Route path='/'>
            <IndexRoute component={SignIn}/>
          </Route>
          <Route path='/home' component={requireAuthentication(Wrapper)}>
            <IndexRoute component={Global}/>
            <Route path='/sites/:siteId/pages/:pageId'
                   component={PageScope}/>
            <Route path='/users/:layerId'
                   component={ConversationWrapper}/>
          </Route>
        </ReduxRouter>
      </Provider>
    );
  }
}