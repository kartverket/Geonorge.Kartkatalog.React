// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import FacetFilterItem from 'components/partials/FacetFilter/FacetFilterItem';
import { ErrorBoundary } from 'components/ErrorBoundary';

// Stylesheets
import style from 'components/partials/FacetFilter.module.scss';

class FacetFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    toggleFacets() {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    renderFacets(availableFacets) {
        const togglefacetClassnames = classNames({
            [style.facetFilter]: true,
            [style.open]: this.state.expanded
        });

        let facets = availableFacets && Object.keys(availableFacets).length
            ? Object.keys(availableFacets).map((facetField, i) => {
                return <ErrorBoundary key={facetField}>
                    <FacetFilterItem
                        facetFilterItem={this.props.availableFacets[facetField]} key={facetField} />
                </ErrorBoundary>;
            })
            : '';
        return (
            <div className={togglefacetClassnames}>
                <label className={style.showLabel}>Valgte filter:</label>
                <ul>
                    {facets}
                </ul>
            </div>);
    }

    render() {
        return (
            <div>
                <div className={style.togglefacet} onClick={() => this.toggleFacets()}><FontAwesomeIcon
                    icon={this.state.expanded ? ['fas', 'times'] : ['far', 'filter']} /></div>
                {this.renderFacets(this.props.availableFacets)}
            </div>
        )
    }
}

// Validering av props...
FacetFilter.propTypes = {
    searchResults: PropTypes.object
};

// Metode som binder state til lokale props
const mapStateToProps = state => ({
    searchResults: state.searchResults,
    availableFacets: state.availableFacets
});


export default connect(mapStateToProps)(FacetFilter);
