import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import configureStore, { history } from '../utils/configureStore'
import '../layout/icons';
import './Wrapper.scss';

const store = configureStore({})
export default class Wrapper extends Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    {this.props.children}
                </ConnectedRouter>
            </Provider>
        )
    }
}
