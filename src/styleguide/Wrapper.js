// Dependencies
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {ConnectedRouter} from 'connected-react-router'

// Components
import 'layout/icons';

// Utils
import configureStore, {history} from 'utils/configureStore'

// Stylesheets
import 'styleguide/Wrapper.module.scss';


const store = configureStore({})
export default class Wrapper extends Component {
  render() {
    return (<Provider store={store}>
      <ConnectedRouter history={history}>
        {this.props.children}
      </ConnectedRouter>
    </Provider>)
  }
}
