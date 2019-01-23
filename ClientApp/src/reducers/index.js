import { combineReducers } from 'redux'
// import { connectRouter } from 'connected-react-router'
import * as counterReducer from './counter';
/*
  console.log(connectRouter());

export default (history) => combineReducers({
  router: connectRouter(history),
  ...reducers,
})*/
/*

const testreducers = {
  counter,
  };

const reducers = (history) => combineReducers({
  router: connectRouter(history),
  ...testreducers,
});

export default reducers;
*/

export default combineReducers({
  counter: counterReducer
})