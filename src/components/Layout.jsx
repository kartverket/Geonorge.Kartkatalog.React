// Dependencies
import React, { useEffect, useRef } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import posthog from "posthog-js";
import { useSelector } from "react-redux";

// Components
import { ErrorBoundary } from "./ErrorBoundary";
import Footer from "./partials/Footer";
import MainNavigationContainer from "./partials/MainNavigationContainer";

// Stylesheets
import style from "./Layout.module.scss";

const Layout = (props) => {
    // Redux store
    const auth = useSelector((state) => state.auth);
    const layoutLoaderData = useLoaderData();
    const location = useLocation();

    // Refs
    const userRef = useRef(null);
    const previousUrlRef = useRef(window.location.href);

    useEffect(() => {
        userRef.current = auth?.user;
    }, [auth]);

    useEffect(() => {
        const currentUrl = window.location.href;

        if (!posthog.has_opted_in_capturing()) {
            previousUrlRef.current = currentUrl;
            return;
        }

        // Emit pageleave only when moving away from a different SPA route.
        if (previousUrlRef.current && previousUrlRef.current !== currentUrl) {
            posthog.capture("$pageleave", {
                $current_url: previousUrlRef.current
            });
        }

        posthog.capture("$pageview", {
            $current_url: currentUrl
        });
        previousUrlRef.current = currentUrl;
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
