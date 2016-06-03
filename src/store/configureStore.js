import { compose, createStore, applyMiddleware } from 'redux';
import { reduxReactRouter } from 'redux-router';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import createHistory from 'history/lib/createHashHistory';
import reducer from '../reducers';

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(
      thunkMiddleware,
      createLogger(),
    ),
    reduxReactRouter({ createHistory })
  )(createStore);

  return finalCreateStore(reducer, initialState);;
}
