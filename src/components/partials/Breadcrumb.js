import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import style from './MainNavigation.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class Breadcrumb extends Component {

    renderBreadcrumb() {
        return (
            <div className={style.breadCrumb}>
                <ul>
                    <li>
                        <Link to={'https://www.geonorge.no/'}>Geonorge</Link>
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
                    <li> <Link to={'/'}>Kartkatalogen</Link> <FontAwesomeIcon title="Tilbake til katalogen" icon={'angle-right'} /></li>
                    <li>{this.props.content}</li>
                </React.Fragment>
            )
        }
        return <li> Kartkatalogen </li>
        }
    

    render() {
        return this.renderBreadcrumb()
    }
}



Breadcrumb.propTypes = {
    content: PropTypes.string,
};

export default connect(null)(Breadcrumb);


