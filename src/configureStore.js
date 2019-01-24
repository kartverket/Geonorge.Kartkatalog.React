import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer  from './reducers';

export const history = createBrowserHistory()



export default function configureStore(preloadedState) {
	const middleware = [thunk];
	const history = {};
	const store = createStore(
		createRootReducer(history), 
		preloadedState,
		compose (
			applyMiddleware(...middleware, routerMiddleware(history)),
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
			) 
		);

	return store;
}

