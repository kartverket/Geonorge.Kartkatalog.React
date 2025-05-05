// Dependencies
import React, { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

// Components
import { ErrorBoundary } from "./ErrorBoundary";
import Footer from "./partials/Footer";
import MainNavigationContainer from "./partials/MainNavigationContainer";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { ContentContainer, GnBookmarkButton } from "@kartverket/geonorge-web-components-test7";

// Stylesheets
import style from "./Layout.module.scss";
import { useSelector } from "react-redux";

const Layout = (props) => {
    // Redux store
    const oidc = useSelector((state) => state.oidc);
    const layoutLoaderData = useLoaderData();
    console.log({ ContentContainer, GnBookmarkButton, layoutLoaderData, userManager: props.userManager, oidc });

    function getToken() {
        //  ["access_token"]
        const token = oidc?.user?.access_token;
        console.log("token", token);
        return token?.length ? `Bearer ${token}` : null;
    }

    useEffect(() => {
        GnBookmarkButton.setup("gn-bookmark-button", {
            getAuthToken: getToken
        });
    }, [getToken, oidc]);

    return (
        <ErrorBoundary>
            <gn-bookmark-button environment="dev"></gn-bookmark-button>
            <MainNavigationContainer layoutLoaderData={layoutLoaderData} userManager={props.userManager} />
            <content-container fullwidth class={style.test} id="main-content">
                <Outlet />
                <Footer />
            </content-container>
        </ErrorBoundary>
    );
};

export default Layout;
