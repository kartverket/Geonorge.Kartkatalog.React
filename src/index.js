// Dependencies
import React from 'react';
import { hydrate, render } from 'react-dom';
import * as serviceWorker from 'serviceWorker';
import WebFont from 'webfontloader';
import 'react-app-polyfill/ie11';

// Components
import App from 'App';
import 'layout/icons';

// Helpers
import { convertSearchParams, convertPath } from 'helpers/UrlHelpers'

// Stylesheets
import 'index.css';

if (window.location.search !== convertSearchParams(window.location.search)) {
  window.location.href = window.location.origin + convertSearchParams(window.location.search);
} else if (window.location.pathname !== convertPath(window.location.pathname)) {
  window.location.href = window.location.origin + convertPath(window.location.pathname) + window.location.search;
} else {
  WebFont.load({
    google: {
      families: ['Raleway:100,400,500,700', 'Open Sans:400,600,700', 'sans-serif']
    }
  });

  const rootElement = document.getElementById("root");
  if (rootElement.hasChildNodes()) {
    hydrate(<App />, rootElement);
  } else {
    render(<App />, rootElement);
  }

  serviceWorker.unregister();
}
