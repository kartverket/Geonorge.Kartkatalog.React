import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './configureStore'

import Home from './components/routes/Home';
import MapContainer from './components/routes/MapContainer';

import MainNavigation from './components/partials/MainNavigation';
import style from './App.scss';

const initialState = {};
const store = configureStore(initialState);


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <MainNavigation />
            <div className={style.pageContent}>
              <Switch>
                <Route exact path="/" render={() => (<Home />)} />
                <Route exact path="/kart" render={() => (<MapContainer />)} />
                <Route render={() => (<div>Miss</div>)} />
              </Switch>
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
