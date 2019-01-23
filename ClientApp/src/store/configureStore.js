import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import rootReducer from '../reducers'

//export const history = createBrowserHistory()

//export default function configureStore(initialStore) {

// In development, use the browser's Redux dev tools extension if installed
// if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
//   enhancers.push(window.devToolsExtension());
//  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION__ : compose);
// }
/*if (isDevelopment && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
}*/


//routerMiddleware(history), // for dispatching history actions

const initialState = {};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,  // root reducer with router state
  initialState,
  compose(
    applyMiddleware(...middleware),
    thunk,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

export default store;

//const history = createBrowserHistory();

//export history;

