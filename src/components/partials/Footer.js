// Dependencies
import React from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";

// Geonorge Webcomponents
import { GeonorgeFooter } from "@kartverket/geonorge-web-components/GeonorgeFooter";

const Footer = () => {
    const location = useLocation();

    // Redux store
    const environment = useSelector((state) => state.environment);
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    const isMapRoute = location?.pathname === "/kart";
    const hasFetchedEnvironmentVariables = !!Object.keys(environment).length;

    return !isMapRoute && hasFetchedEnvironmentVariables ? (
        <geonorge-footer
            language={selectedLanguage}
            environment={environment?.environment}
            version={environment?.buildNumber}
        />
    ) : null;
};

export default Footer;
