import {createBrowserHistory} from 'history';
import { routerMiddleware } from 'connected-react-router';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {loadUser} from 'redux-oidc';
import thunk from 'redux-thunk';
import createRootReducer from 'reducers';
import googleTagManager from 'utils/googleTagManager';

export const history = createBrowserHistory();

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

export default function configureStore(preloadedState, userManager) {
  const middleware = [googleTagManager, thunk];
	const history = createBrowserHistory();
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        ...middleware,
				routerMiddleware(history)
      )
    )
  );

  return userManager.then((values) => {
		loadUser(store, values);
		return store;
	})

}
