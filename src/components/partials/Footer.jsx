// Dependencies
import React from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";

// Geonorge Webcomponents
import { GeonorgeFooter } from "@kartverket/geonorge-web-components/GeonorgeFooter";

import style from "@/components/partials/Footer.module.scss";

const Footer = () => {
    const location = useLocation();

    // Redux store
    const environment = useSelector((state) => state.environment);
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    const isMapRoute = location?.pathname === "/kart";
    const hasFetchedEnvironmentVariables = !!Object.keys(environment).length;

    return !isMapRoute && hasFetchedEnvironmentVariables ? (
        <footer className={style.footer}>
            <div className={style.bugPeephole}>
                <img src="/marihone.png" alt="" aria-hidden="true" className={`${style.bug} ${style.bugBefore}`} />
                <img src="/marihone_copy.png" alt="" aria-hidden="true" className={`${style.bug} ${style.bugAfter}`} />
            </div>
            <geonorge-footer
                language={selectedLanguage}
                environment={environment?.environment}
                version={environment?.buildNumber}
                accessibilitystatementurl={environment?.accessibilityStatementUrl}
            />
        </footer>
    ) : null;
};

export default Footer;
