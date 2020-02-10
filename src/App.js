// Dependencies
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {OidcProvider} from 'redux-oidc';
import {Route, Switch} from 'react-router';
import {ConnectedRouter} from 'connected-react-router';
import { Helmet } from 'react-helmet';

// Utils
import configureStore, {history} from 'utils/configureStore';
import userManager from 'utils/userManager';

// Actions
import {fetchResources} from 'actions/ResourceActions';
import {fetchGeonorgeMenu} from 'actions/MainNavigationActions';
import {fetchSelectedLanguage} from 'actions/SelectedLanguageActions';
import {getEnvironment} from 'actions/EnvironmentActions';

// Components
import NotFound from 'components/routes/NotFound';
import Home from 'components/routes/Home';
import OidcCallback from 'components/routes/OidcCallback';
import OidcSignoutCallback from 'components/routes/OidcSignoutCallback';
import Footer from 'components/partials/Footer';
import MapContainer from 'components/routes/MapContainer';
import Metadata from "components/routes/Metadata";
import MainNavigation from 'components/partials/MainNavigation';

// Stylesheets
import style from 'App.module.scss';
import 'scss/styles.scss';

const initialState = {};
const store = configureStore(initialState);

class App extends Component {

  componentDidMount() {
    store.dispatch(fetchSelectedLanguage());
    store.dispatch(fetchResources());
    store.dispatch(fetchGeonorgeMenu());
    store.dispatch(getEnvironment());
  }

  render() {
    return (<Provider store={store}>
      <OidcProvider userManager={userManager} store={store}>
        <ConnectedRouter history={history}>
          <div className={style.kartkatalogen}>
            <Helmet>
              {process.env.REACT_APP_ENVIRONMENT && process.env.REACT_APP_ENVIRONMENT.length
                ? (<meta name="robots" content="noindex" />)
                : ''
              }
            </Helmet>
            <MainNavigation/>
            <div className={style.pageContent}>
              <div className={style.container}>
                <Switch>
                  <Route exact path="/" render={() => (<Home/>)}/>
                  <Route exact path="/search" render={() => (<Home/>)}/>
                  <Route exact path="/signin-oidc" render={() => (<OidcCallback/>)}/>
                  <Route exact path="/signout-callback-oidc" render={() => (<OidcSignoutCallback/>)}/>
                  <Route exact path="/kart" render={() => (<MapContainer/>)}/>
                  <Route exact path="/metadata/:title/:uuid" render={(props) => (<Metadata {...props}/>)}/>
                  <Route exact path="/metadata/:uuid" render={(props) => (<Metadata {...props}/>)}/>
                  <Route exact path="/:category" render={(props) => (<Home {...props}/>)}/>
                  <Route render={() => (<NotFound/>)}/>
                </Switch>
              </div>
              <footer className={style.footer}>
                <Route exact path="/" render={() => (<Footer/>)}/>
              </footer>
            </div>
          </div>
        </ConnectedRouter>
      </OidcProvider>
    </Provider>);
  }
}

export default App;
