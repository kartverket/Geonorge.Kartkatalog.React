// Dependencies
import React from "react";
import { createRoot } from "react-dom/client";
import * as serviceWorker from "serviceWorker";
import "react-app-polyfill/ie11";

// Components
import App from "App";
import "layout/icons";

// Helpers
import { convertSearchParams, convertPath } from "helpers/UrlHelpers";

// Stylesheets
import "index.css";

if (window.location.search !== convertSearchParams(window.location.search)) {
    window.location.href = window.location.origin + convertSearchParams(window.location.search);
} else if (window.location.pathname !== convertPath(window.location.pathname)) {
    window.location.href = window.location.origin + convertPath(window.location.pathname) + window.location.search;
} else {
    if (window.location.hostname === "localhost") {
        window.sessionStorage.setItem("isLocalKartkatalogEnvironment", "true");
    } else {
        window.sessionStorage.removeItem("isLocalKartkatalogEnvironment");
    }

    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(<App />);

    serviceWorker.unregister();
}
