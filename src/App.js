import React, {Component} from 'react';
import {Provider} from 'react-redux';

import {Route, Switch} from 'react-router'
import {ConnectedRouter} from 'connected-react-router'
import configureStore, {history} from './utils/configureStore'


import Home from './components/routes/Home';
import Footer from './components/partials/Footer';
import MapContainer from './components/routes/MapContainer';
import Metadata from "./components/routes/Metadata";

import MainNavigation from './components/partials/MainNavigation';
import style from './App.scss';

import './scss/styles.scss';
import {fetchArticleSearchResults, fetchMetadataSearchResults} from "./actions/SearchResultActions";

const initialState = {};
const store = configureStore(initialState);

class App extends Component {
    componentWillMount() {
        store.dispatch(fetchMetadataSearchResults());
        store.dispatch(fetchArticleSearchResults());
    }

    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <div className="kartkatalogen">
                        <MainNavigation/>
                        <div className={style.pageContent}>
                            <div className={style.container}>
                                <Switch>
                <Route exact path="/" render={() => (<Home />)} />
                <Route exact path="/kart" render={() => (<MapContainer />)} />
                <Route render={() => (<div>Miss</div>)} />
                                    <Route render={() => (<div>Miss</div>)}/>
                                </Switch>
                            </div>
                            <footer className={style.footer}>
                                <Route exact path="/" render={() => (<Footer/>)}/>
                            </footer>
                        </div>
                    </div>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default App;
