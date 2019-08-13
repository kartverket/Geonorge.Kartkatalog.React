import React, {Component} from 'react';
import { connect } from 'react-redux';
import { updateAvailableFacets, updateSelectedFacetsFromUrl } from '../../actions/FacetFilterActions'
import { getResource } from '../../actions/ResourceActions'
import {ErrorBoundary} from '../ErrorBoundary'
import {getQueryStringFromFacets} from '../../helpers/FacetFilterHelpers'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

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

    renderSelectedFacetType(facetType, facet = null) {
        
        if(facetType.facets && Object.keys(facetType.facets).length) {
            return Object.keys(facetType.facets).map(facetName => {                
                facet = facet ? facet : facetType.facets[facetName];
                const hasChildren = facet.facets && Object.keys(facet.facets).length;        
                let childFacetElements = []                      
                if(hasChildren) {                    
                   const childFacets = facet.facets;
                    Object.keys(childFacets).forEach(childFacetKey => {
                        const childFacet = childFacets[childFacetKey]
                        childFacetElements.push(this.renderSelectedFacetType(facetType, childFacet))
                    });                    
                }              
                return (   
                    <div key={facet.Name}> 
                        {childFacetElements}
                        <span>{facet.NameTranslated} <Link to={this.getRemoveFacetQueryString(facet, facetType.Name)}> X</Link></span>                    
                    </div>
                )                
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
        )}
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