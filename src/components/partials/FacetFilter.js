import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FacetFilterItem from './FacetFilter/FacetFilterItem';


import style from './FacetFilter.scss';

class FacetFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    getFacetFilterItems() {
        return this.props.availableFacets ? Object.keys(this.props.availableFacets) : [];
    }

    renderFacets() {
        let availableFacets = this.getFacetFilterItems();
        let facets = availableFacets.map((facetField, i) => {
            return <FacetFilterItem facetFilterItem={this.props.availableFacets[facetField]} key={facetField}/>;
        });
        return React.createElement('ul', { className: style.facetFilter }, facets);
    }
    
    render() {
        return (
            <div>
            {this.renderFacets()}
            </div>
            )
    }
}

FacetFilter.propTypes = {
    searchResults: PropTypes.object
}

const mapStateToProps = state => ({
    searchResults: state.searchResults,
    availableFacets: state.availableFacets
});

export default connect(mapStateToProps)(FacetFilter);