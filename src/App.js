// Dependencies
import React, { Component, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { OidcProvider } from "redux-oidc";
import { Route, Routes } from "react-router";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Utils
import configureStore, { history } from "utils/configureStore";
import userManagerPromise from "utils/userManager";

// Actions
import { fetchResources } from "actions/ResourceActions";
import { fetchSelectedLanguage } from "actions/SelectedLanguageActions";
import { getEnvironment } from "actions/EnvironmentActions";
import { fetchAvailableWFSServiceStatuses, fetchAvailableWMSServiceStatuses } from "actions/ServiceStatusActions";

// Components
import NotFound from "components/routes/NotFound";
import Home from "components/routes/Home";
import OidcCallback from "components/routes/OidcCallback";
import OidcSignoutCallback from "components/routes/OidcSignoutCallback";
import Footer from "components/partials/Footer";
import MapContainer from "components/routes/MapContainer";
import Metadata from "components/routes/Metadata";
import MainNavigationContainer from "components/partials/MainNavigationContainer";

// Stylesheets
import "scss/styles.scss";

const initialState = {};
const storePromise = configureStore(initialState, userManagerPromise);
let store = null;
let userManager = null;

const App = () => {
    // State
    const [storeIsLoaded, setStoreIsLoaded] = useState(false);
    const [userManagerIsLoaded, setUserManagerIsLoaded] = useState(false);

    useEffect(() => {
        storePromise.then((storeConfig) => {
            store = storeConfig;
            setStoreIsLoaded(true);
        });
        userManagerPromise.then((userManagerConfig) => {
            userManager = userManagerConfig;
            setUserManagerIsLoaded(true);
        });
    }, []);

    useEffect(() => {
      if (storeIsLoaded){
        store.dispatch(fetchSelectedLanguage());
        store.dispatch(fetchResources());
        store.dispatch(fetchAvailableWFSServiceStatuses());
        store.dispatch(fetchAvailableWMSServiceStatuses());
        store.dispatch(getEnvironment());
      }
    }, [storeIsLoaded]);

    if (userManager && userManagerIsLoaded && storeIsLoaded) {
        return (
            <Provider store={store}>
                <OidcProvider userManager={userManager} store={store}>
                    <HelmetProvider>
                        <Router history={history}>
                            <div className={style.kartkatalogen}>
                                <Helmet>
                                    {process.env.REACT_APP_ENVIRONMENT && process.env.REACT_APP_ENVIRONMENT.length ? (
                                        <meta name="robots" content="noindex" />
                                    ) : (
                                        ""
                                    )}
                                </Helmet>
                                <MainNavigationContainer userManager={userManager} />
                                <div className={style.pageContent}>
                                    <div className={style.container}>
                                        <Routes>
                                            <Route exact path="/signin-oidc" element={<OidcCallback userManager={userManager}/>} />
                                            <Route
                                                exact
                                                path="/signout-callback-oidc"
                                                element={<OidcSignoutCallback userManager={userManager} />}
                                            />
                                            <Route exact path="/" element={<Home />} />
                                            <Route exact path="/search" element={<Home />} />
                                            <Route exact path="/kart" element={<MapContainer />} />
                                            <Route
                                                exact
                                                path="/metadata/:organizaton/:title/:uuid"
                                                element={<Metadata />}
                                            />
                                            <Route exact path="/metadata/:title/:uuid" element={<Metadata />} />
                                            <Route exact path="/metadata/:uuid" element={<Metadata />} />
                                            <Route exact path="/:category" element={<Home />} />
                                            <Route path="*" element={<NotFound />} />
                                            <Route key={"/shell.html"} path="/shell.html" element={() => null} />
                                            <Route key={"/404.html"} element={<NotFound />} />
                                        </Routes>
                                    </div>
                                    <Footer />
                                </div>
                            </div>
                        </Router>
                    </HelmetProvider>
                </OidcProvider>
            </Provider>
        );
    } else {
        return "";
    }
};

export default App;
