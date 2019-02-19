import React, {Component} from 'react';
import {connect} from 'react-redux';

import SearchResults from '../partials/SearchResults';
import { ErrorBoundary } from '../../components/ErrorBoundary'

import style from './Home.scss';

class Home extends Component {
    render() {
        return (
            <div>
                <div className={style.header}>
                    <h1>Kartkatalogen</h1>
                </div>
                <ErrorBoundary><SearchResults/></ErrorBoundary>
            </div>
        )
    }
}

export default connect(null)(Home);
