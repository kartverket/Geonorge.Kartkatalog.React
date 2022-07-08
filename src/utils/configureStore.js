import {createBrowserHistory} from 'history';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {loadUser} from 'redux-oidc';
import userManager from 'utils/userManager';
import thunk from 'redux-thunk';
import createRootReducer from 'reducers';
import googleTagManager from 'utils/googleTagManager';

export const history = createBrowserHistory();

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

export default function configureStore(preloadedState) {
  const middleware = [googleTagManager, thunk];
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  );

  loadUser(store, userManager);

  return store;
}
