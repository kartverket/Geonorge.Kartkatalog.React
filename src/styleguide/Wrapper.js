import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore, { history } from '../utils/configureStore'
import '../layout/icons';

const store = configureStore({})
export default class Wrapper extends Component {
    render() {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        )
    }
}
