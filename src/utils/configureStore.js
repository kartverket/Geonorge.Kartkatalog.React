import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createRootReducer from '../reducers';

export const history = createBrowserHistory()

const composeEnhancers = composeWithDevTools({
	// options like actionSanitizer, stateSanitizer
});

export default function configureStore(preloadedState) {
	const middleware = [thunk];
	const history = {};
	const store = createStore(
		createRootReducer(history),
		preloadedState,
		composeEnhancers(
			applyMiddleware(...middleware, routerMiddleware(history)),
		)
	);

	return store;
}

