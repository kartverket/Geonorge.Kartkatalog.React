import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export class Breadcrumb extends Component {

    renderBreadcrumb() {
        return (
            <div>
                <ul>
                    <li>
                        <Link to={'https://www.geonorge.no/'}>Geonorge</Link>
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
                    <li> <Link to={'/'}>Kartkatalogen</Link> </li>
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


