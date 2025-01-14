import { configureStore, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createInjectorsEnhancer } from 'redux-injectors';
import { createBrowserHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { loadUser } from 'redux-oidc';

import createReducer from './rootReducer';
import rootSaga from './rootSaga';
import { userManager } from '../auth/userManager';

export const history = createBrowserHistory();

export default function configureAppStore(initialState = {}): Store {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  const middlewares = [sagaMiddleware, routerMiddleware(history)];
  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const router = {
    router: connectRouter(history),
  };

  const store = configureStore({
    reducer: createReducer(router),
    middleware: (defaultMiddleware) => [
      ...defaultMiddleware({
        serializableCheck: {
          ignoredActions: ['redux-oidc/USER_FOUND'],
          ignoredPaths: ['oidc.user'],
        },
      }),
      ...middlewares,
    ],
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
    enhancers,
  });

  sagaMiddleware.run(rootSaga);

  loadUser(store, userManager).then();

  return store;
}
