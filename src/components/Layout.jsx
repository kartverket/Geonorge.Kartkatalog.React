// Dependencies
import React, { useEffect, useRef } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import posthog from "posthog-js";

// Components
import { ErrorBoundary } from "./ErrorBoundary";
import Footer from "./partials/Footer";
import MainNavigationContainer from "./partials/MainNavigationContainer";

// Stylesheets
import style from "./Layout.module.scss";
import { useSelector } from "react-redux";

const Layout = (props) => {
    // Redux store
    const auth = useSelector((state) => state.auth);
    const layoutLoaderData = useLoaderData();
    const location = useLocation();

    // Refs
    const userRef = useRef(null);
    const hasTrackedInitialRoute = useRef(false);

    useEffect(() => {
        userRef.current = auth?.user;
    }, [auth]);

    useEffect(() => {
        if (!hasTrackedInitialRoute.current) {
            hasTrackedInitialRoute.current = true;
            return;
        }

        if (!posthog.has_opted_in_capturing()) {
            return;
        }

        posthog.capture("$pageview", {
            $current_url: window.location.href
        });
    }, [location.pathname, location.search, location.hash]);

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
