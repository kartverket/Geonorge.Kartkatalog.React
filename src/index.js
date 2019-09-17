import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import WebFont from 'webfontloader';
import { convertSearchParams, convertPath } from './helpers/UrlHelpers'
import './layout/icons';
import 'react-app-polyfill/ie11';

if (window.location.search !== convertSearchParams(window.location.search)) {
    window.location.href = window.location.origin + convertSearchParams(window.location.search);
} else if(window.location.pathname !== convertPath(window.location.pathname)){
    window.location.href = window.location.origin + convertPath(window.location.pathname) + window.location.search;
} else {
    WebFont.load({
        google: {
            families: ['Raleway:100,400,500,700', 'Open Sans:400,600,700', 'sans-serif']
        }
    });
    ReactDOM.render(<App />, document.getElementById('root'));
    serviceWorker.unregister();
}



