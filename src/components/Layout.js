// Dependencies
import React, { useEffect, useRef } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

// Components
import { ErrorBoundary } from "./ErrorBoundary";
import Footer from "./partials/Footer";
import MainNavigationContainer from "./partials/MainNavigationContainer";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { GnShortcutButton } from "@kartverket/geonorge-web-components";

// Stylesheets
import style from "./Layout.module.scss";
import { useSelector } from "react-redux";

const Layout = (props) => {
    // Redux store
    const oidc = useSelector((state) => state.oidc);
    const environment = useSelector((state) => state.environment);
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    const layoutLoaderData = useLoaderData();

    // Refs
    const userRef = useRef(null);

    function getToken() {
        const token = oidc?.user?.access_token;
        return token?.length ? token : null;
    }

    useEffect(() => {
        userRef.current = oidc?.user;
    }, [oidc]);

    useEffect(() => {
        const isLoggedIn = !!oidc?.user?.access_token?.length;
        if (isLoggedIn) {
            GnShortcutButton.setup("gn-shortcut-button", {
                getAuthToken: getToken
            });
        }
    }, [getToken, oidc]);

    return (
        <ErrorBoundary>
            <gn-shortcut-button language={selectedLanguage} environment={environment?.environment}></gn-shortcut-button>
            <MainNavigationContainer layoutLoaderData={layoutLoaderData} userManager={props.userManager} />
            <content-container fullwidth class={style.test} id="main-content">
                <Outlet />
                <Footer />
            </content-container>
        </ErrorBoundary>
    );
};

export default Layout;
