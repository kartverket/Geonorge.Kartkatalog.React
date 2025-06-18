// Dependencies
import React, { useEffect, useRef } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

// Components
import { ErrorBoundary } from "./ErrorBoundary";
import Footer from "./partials/Footer";
import MainNavigationContainer from "./partials/MainNavigationContainer";

// Stylesheets
import style from "./Layout.module.scss";
import { useSelector } from "react-redux";

const Layout = (props) => {
    // Redux store
    const oidc = useSelector((state) => state.oidc);
    const layoutLoaderData = useLoaderData();

    // Refs
    const userRef = useRef(null);

    useEffect(() => {
        userRef.current = oidc?.user;
    }, [oidc]);

    return (
        <ErrorBoundary>
            <MainNavigationContainer layoutLoaderData={layoutLoaderData} userManager={props.userManager} />
            <content-container fullwidth class={style.test} id="main-content">
                <Outlet />
                <Footer />
            </content-container>
        </ErrorBoundary>
    );
};

export default Layout;
