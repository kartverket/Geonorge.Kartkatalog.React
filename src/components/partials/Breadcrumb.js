// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { getResource } from 'actions/ResourceActions';

// Stylesheets
import style from 'components/partials/MainNavigation.module.scss';


export class Breadcrumb extends Component {

    renderBreadcrumb() {
        return (
            <div className={style.breadCrumb}>
                <ul vocab="https://schema.org/" typeof="BreadcrumbList">
                    <li property="itemListElement" typeof="ListItem">
                        <a property="item" typeof="WebPage" href={'https://www.geonorge.no/'}>
                          <span property="name">Geonorge</span>
                        </a>
                         <meta property="position" content="1" />
                        <FontAwesomeIcon title="Til Geonorge" icon={'angle-right'} />
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
                    <li property="itemListElement" typeof="ListItem">
                      <Link to={'/'} property="item" typeof="WebPage">
                        <span property="name">{ this.props.getResource('AppPageTitle', 'Kartkatalogen') }</span>
                      </Link>
                      <meta property="position" content="2" />
                      <FontAwesomeIcon title="Tilbake til katalogen" icon={'angle-right'} />
                    </li>
                    <li property="itemListElement" typeof="ListItem">
                      <span property="name">{this.props.content}</span>
                      <meta property="position" content="3" />
                    </li>
                </React.Fragment>
            )
        }
        return (
          <li> { this.props.getResource('AppPageTitle', 'Kartkatalogen') } </li>
        )
    }

    render() {
        return this.renderBreadcrumb()
    }
}



Breadcrumb.propTypes = {
    content: PropTypes.string,
};

const mapStateToProps = state => ({
    resources: state.resources,
    searchString: state.searchString
});

const mapDispatchToProps = {
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumb);
