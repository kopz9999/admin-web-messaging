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

// App Store
import configureStore from '../store/configureStore';

export default class App extends Component {
  render() {
    const { appId } = this.props;
    const client = new Client({appId: appId });
    const store = configureStore(client);

    return (
      <LayerProvider client={client}>
        <Provider store={store}>
          <ReduxRouter>
            <Route path='/'>
              <IndexRoute component={SignIn}/>
            </Route>
            <Route path='/home' component={Wrapper}>
              <IndexRoute component={Website}/>
            </Route>
          </ReduxRouter>
        </Provider>
      </LayerProvider>
    );
  }
}