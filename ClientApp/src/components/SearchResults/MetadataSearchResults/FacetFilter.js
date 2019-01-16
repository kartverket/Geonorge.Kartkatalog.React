import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FacetField } from './FacetFilter/FacetField';
import style from './FacetFilter.scss';

export class FacetFilter extends Component {
    displayName = FacetFilter.name

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static propTypes = {
        getRootStateValue: PropTypes.func.isRequired,
        updateRootState: PropTypes.func.isRequired,
        showResults: PropTypes.func.isRequired
    }


    getFacetFields() {
        let selectedType = this.props.getRootStateValue('selectedType');
        let availableFacets = this.props.getRootStateValue('availableFacets');
        let facetFields = availableFacets[selectedType] ? availableFacets[selectedType] : [];
        return facetFields;
    }

    renderList() {
        let facetFields = this.getFacetFields();
        let facetFieldElements = Object.keys(facetFields).map(key => {
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