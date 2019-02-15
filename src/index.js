import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import WebFont from 'webfontloader';
import './layout/icons';

WebFont.load({
    google: {
        families: ['Raleway:100,400,500,700', 'Open Sans:400,600,700', 'sans-serif']
    }
});

ReactDOM.render(<App/>, document.getElementById('root'));

serviceWorker.unregister();
