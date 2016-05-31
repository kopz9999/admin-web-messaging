import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { IndexRoute, Route } from 'react-router';
import { ReduxRouter } from 'redux-router';
// Layer
import { LayerProvider } from 'layer-react';
// App Components
import Wrapper from './timeline/Wrapper';
import Global from './timeline/Global';
import Site from './timeline/Site';
import Page from './timeline/Page';
import SignIn from './login/SignIn';
import Conversation from './timeline/Conversation';

export default class App extends Component {
  render() {
    const { client, store } = this.props;

    return (
      <LayerProvider client={client}>
        <Provider store={store}>
          <ReduxRouter>
            <Route path='/'>
              <IndexRoute component={SignIn}/>
            </Route>
            <Route path='/home' component={Wrapper}>
              <IndexRoute component={Global}/>
              <Route path='/sites/:siteId'
                     component={Site}/>
              <Route path='/sites/:siteId/pages/:pageId'
                     component={Page}/>
              <Route path='/sites/:siteId/pages/:pageId/users/:layerId/conversations/:conversationId'
                     component={Conversation}/>
            </Route>
          </ReduxRouter>
        </Provider>
      </LayerProvider>
    );
  }
}