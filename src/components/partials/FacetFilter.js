import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';
import Facet from './FacetFilter/Facet';

import FacetFilterItem from './FacetFilter/FacetFilterItem';
import {ErrorBoundary} from '../../components/ErrorBoundary'


import style from './FacetFilter.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class FacetFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    getFacetFilterItems() {
        return this.props.availableFacets ? Object.keys(this.props.availableFacets) : [];
    }

    getSelectedFacetItems() {
        return this.props.selectedFacets ? Object.keys(this.props.selectedFacets) : [];
    }

    toggleFacets() {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    renderSelectedFacets() {
        const selectedFacetsList = Object.keys(this.props.selectedFacets)
            .filter(facetField => {
                return this.props.selectedFacets[facetField] && this.props.selectedFacets[facetField].facets && Object.keys(this.props.selectedFacets[facetField].facets).length
            })
            .map(facetField => {
                let selectedFacetsInFacetField = this.props.selectedFacets[facetField].facets; // Facets in facet field
                return Object.keys(selectedFacetsInFacetField)
                    .map(facetName => {
                        return <Facet removable={true} facet={selectedFacetsInFacetField[facetName]}
                                      facetField={facetField} parentFacet={this.props.facet} key={facetName}/>;
                    })
            });
        return <div>{selectedFacetsList}</div>
    }

    hasSelectedFacets() {
        let hasSelectedFacets = false;
        Object.keys(this.props.selectedFacets).forEach(facetField => {
                if (this.props.selectedFacets[facetField].length) {
                    hasSelectedFacets = true;
                    return false;
                }
            }
        );
        return hasSelectedFacets;
    }

    renderFacets() {
        const togglefacetClassnames = classNames({
            [style.facetFilter]: true,
            open: this.state.expanded
        });


        let availableFacets = this.getFacetFilterItems();
        let facets = availableFacets.map((facetField, i) => {
            return <ErrorBoundary key={facetField}>
                <FacetFilterItem
                    facetFilterItem={this.props.availableFacets[facetField]} key={facetField}/>
            </ErrorBoundary>;
        });
        return (
            <div className={togglefacetClassnames}>
                <label className={this.hasSelectedFacets() ? style.hideLabel : style.showLabel}>Valgte filter: </label>
                {this.renderSelectedFacets()}
                <ul>
                    {facets}
                </ul>
            </div>);
    }

    render() {
        return (
            <div>
                <div className={style.togglefacet} onClick={() => this.toggleFacets()}><FontAwesomeIcon
                    icon={this.state.expanded ? ['fas', 'times'] : ['far', 'filter']}/></div>
                {this.renderFacets()}
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
    availableFacets: state.availableFacets,
    selectedFacets: state.selectedFacets
});

export default connect(mapStateToProps)(FacetFilter);