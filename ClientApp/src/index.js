import React from 'react';
import ReactDOM from 'react-dom';
import { Provider  } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store from './store/configureStore';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader';
import './layout/icons';


// Get the application-wide store instance, prepopulating with state from the server where available.
const rootElement = document.getElementById('root');

WebFont.load({
  google: {
    families: ['Raleway:100,400,500,700', 'Open Sans:400,600,700', 'sans-serif']
  }
});


ReactDOM.render(
  <Provider store={store}>
      <App/>
  </Provider>,
  rootElement);

registerServiceWorker();
