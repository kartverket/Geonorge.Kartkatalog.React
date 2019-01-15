import React, { Component } from 'react';
import { FacetField } from './FacetFilter/FacetField';
import style from './FacetFilter.scss';

export class FacetFilter extends Component {
    displayName = FacetFilter.name

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    getFacetFields() {
        let selectedType = this.props.getRootStateValue('selectedType');
        //let selectedSubType = this.props.getRootStateValue('selectedSubType');
        //let searchResults = this.props.getRootStateValue('searchResults');
        //let filterItems = searchResults[selectedType][selectedSubType] ? searchResults[selectedType][selectedSubType].Facets : [];
        let availableFacets = this.props.getRootStateValue('availableFacets');
        let facetFields = availableFacets[selectedType] ? availableFacets[selectedType] : [];
        return facetFields;
    }

    renderList() {
        let facetFields = this.getFacetFields();
        let facetFieldElements = Object.keys(facetFields).map(key => {
            console.log(key);
            return <FacetField 
            getRootStateValue={this.props.getRootStateValue.bind(this)} 
            updateRootState={this.props.updateRootState.bind(this)} 
            facetField={key}
            facets={facetFields[key]} key={key} 
            showResults={this.props.showResults.bind(this)} />;
        });
        return React.createElement('ul', { className: style.facetFilter }, facetFieldElements);
    }

    render() {
        return (
            <div>
                {this.renderList()}
            </div>
        );
    }
}