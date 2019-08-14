// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Link} from "react-router-dom";
import style from './SelectedFacets.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

// Actions
import { updateAvailableFacets, updateSelectedFacetsFromUrl } from '../../actions/FacetFilterActions';
import { getResource } from '../../actions/ResourceActions';

// Helpers
import { getQueryStringFromFacets } from '../../helpers/FacetFilterHelpers';


class SelectedFacets extends Component {
    renderSelectedFacetsList() {
        if (this.props.selectedFacets && Object.keys(this.props.selectedFacets).length) {
            return Object.keys(this.props.selectedFacets).map(facetTypeName => {
                const facetType = this.props.selectedFacets[facetTypeName];
                return (
                    this.renderSelectedFacetType(facetType)
                )
            });
        }
    }

    renderSelectedFacetType(facetType, childFacet) {

        if (facetType.facets && Object.keys(facetType.facets).length) {
            return Object.keys(facetType.facets).map(facetTypeKey => {
                const facet = childFacet ? childFacet : facetType.facets[facetTypeKey];
                const hasChildren = facet.facets && Object.keys(facet.facets).length;
                let childFacetElements = []
                if (hasChildren) {
                    const childFacets = facet.facets;
                    Object.keys(childFacets).forEach(childFacetKey => {
                        const childFacet = childFacets[childFacetKey]
                        childFacetElements.push(this.renderSelectedFacetType(facetType, childFacet))
                    });                    
                }              
                return (   
                    <div key={facet.Name} className={style.facet}> 
                        {childFacetElements}
                        <span>{facet.NameTranslated} <Link to={this.getRemoveFacetQueryString(facet, facetType.Name)}> 
                        <FontAwesomeIcon
                               title={'Fjern'} icon={['fas', 'times']}/></Link></span>                    
                    </div>
                );
            })
        }
    }
    getRemoveFacetQueryString(facet, facetField) {
        return getQueryStringFromFacets(
            this.props.selectedFacets,
            this.props.searchString,
            {
                facetToRemove: {
                    facetField,
                    facet
                }
            });
    }

    render() {
        return (
            <div>{this.renderSelectedFacetsList()}</div>
        )
    }
}

const mapStateToProps = state => ({
    selectedFacets: state.selectedFacets
});
const mapDispatchToProps = {
    updateSelectedFacetsFromUrl,
    updateAvailableFacets,
    getResource
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectedFacets);