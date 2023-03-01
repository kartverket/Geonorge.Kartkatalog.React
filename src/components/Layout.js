// Dependencies
import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";

// Components
import { ErrorBoundary } from "./ErrorBoundary";
import Footer from "./partials/Footer";
import MainNavigationContainer from "./partials/MainNavigationContainer";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { ContentContainer } from "@kartverket/geonorge-web-components";

// Stylesheets
import style from "./Layout.module.scss";

const Layout = (props) => {
    const layoutLoaderData = useLoaderData();
    return (
        <ErrorBoundary>
            <MainNavigationContainer layoutLoaderData={layoutLoaderData} userManager={props.userManager} />
            <content-container fullwidth class={style.test}>
                <Outlet />
                <Footer />
            </content-container>
        </ErrorBoundary>
    );
};

export default Layout;
