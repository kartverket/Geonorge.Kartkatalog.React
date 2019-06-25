import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getResource } from '../../actions/ResourceActions';
import style from './MainNavigation.scss';

export class Breadcrumb extends Component {

    renderBreadcrumb() {
        return (
            <div className={style.breadCrumb}>
                <ul>
                    <li>
                        <a href={'https://www.geonorge.no/'}>Geonorge</a>
                        <FontAwesomeIcon title="Tilbake til katalogen" icon={'angle-right'} />
                    </li>
                    {this.renderCurrentBreadcrumb()}
                </ul>
            </div>
        )
    }

    renderCurrentBreadcrumb() {
        if (this.props.content) {
            return (
                <React.Fragment>
                    <li> <Link to={'/'}>{ this.props.getResource('AppPageTitle', 'Kartkatalogen') }</Link> <FontAwesomeIcon title="Tilbake til katalogen" icon={'angle-right'} /></li>
                    <li>{this.props.content}</li>
                </React.Fragment>
            )
        }
        return <li> { this.props.getResource('AppPageTitle', 'Kartkatalogen') } </li>
    }

    render() {
        return this.renderBreadcrumb()
    }
}



Breadcrumb.propTypes = {
    content: PropTypes.string,
};

const mapStateToProps = state => ({
    resources: state.resources
});

const mapDispatchToProps = {
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumb);

