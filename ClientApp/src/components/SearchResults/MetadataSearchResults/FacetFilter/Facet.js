import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import { FacetField } from './FacetField';
import style from './Facet.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class Facet extends Component {
    displayName = Facet.name

    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
    }

    static propTypes = {
        facetField: PropTypes.string.isRequired,
        facet: PropTypes.shape({
            Count: PropTypes.number.isRequired,
            Name: PropTypes.string.isRequired
        }),
        getRootStateValue: PropTypes.func.isRequired,
        updateRootState: PropTypes.func.isRequired,
        showResults: PropTypes.func.isRequired
    }

    removeFacetFromArray(array, value) {
        if (array[this.props.facetField]) {
            array[this.props.facetField] = array[this.props.facetField].filter((selectedFacet) => {
                return selectedFacet.Name !== value.Name;
            });
        }
        this.setState({
            checked: false
        });
        return array;
    }

    addFacetToArray(array, value) {
        if (!array[this.props.facetField]) {
            array[this.props.facetField] = [];
        }
        array[this.props.facetField].push(value);
        this.setState({
            checked: true
        });
        return array;
    }

    toggleFacet() {
        let selectedFacets = this.props.getRootStateValue('selectedFacets');

        if (this.state.checked) {
            selectedFacets = this.removeFacetFromArray(selectedFacets, this.props.facet);
        } else {
            selectedFacets = this.addFacetToArray(selectedFacets, this.props.facet);
        }
        this.props.updateRootState('selectedFacets', selectedFacets);
        let searchString = this.getUrlParametersFromSelectedFacets(selectedFacets);

        this.props.showResults(searchString, null, null)
    }

    getUrlParametersFromSelectedFacets(selectedFacets) {
        let urlParameters = [];
        let facetIndex = 0;
        for (let [type, facets] of Object.entries(selectedFacets)) {
            if (selectedFacets.hasOwnProperty(type)) {
                facets.forEach((facet) => {
                    urlParameters.push(`facets[${facetIndex}]name=${type}&facets[${facetIndex}]value=${facet.Name}`);
                    facetIndex++;
                })
            }
        }
        let urlParameterString = urlParameters.join('&');
        return urlParameterString;
    }

    isChecked = () => {
        let isChecked = false;
        let selectedFacets = this.props.getRootStateValue('selectedFacets');
        if (selectedFacets[this.props.facetField]) {
            selectedFacets[this.props.facetField].forEach((selectedFacet) => {
                if (selectedFacet.Name == this.props.facet.Name) {
                    isChecked = true;
                    this.setState({
                        checked: true
                    });
                }
            })
        }
        if (!isChecked) {
            this.setState({
                checked: false
            });
        }
    }

    componentDidMount() {
        this.isChecked();
    }

    renderList() {
        if (this.props.facet.FacetResults) {
            let filterItemElements = '';/*this.props.facet.FacetResults.map((facetField, i) => {
                return <FacetField filterItem={filterItem} key={i} />;
            });*/
            return React.createElement('ul', { className: style.filterItems }, filterItemElements);
        } else {
            return "";
        }

    }

    render() {
        let liClassNames = classNames({
            [style.facet]: true,
            [style.empty]: this.props.facet.Count == 0,
            'facetelement': true
        });
        return (
            <li className={liClassNames}>
                <input type="checkbox" checked={this.state.checked} onChange={() => this.toggleFacet()} id={this.props.facet.Name} name={this.props.facet.Name} value={this.props.facet.Name} />
                <FontAwesomeIcon className="svg-checkbox" icon={this.state.checked ? ['far', 'check-square'] : ['far', 'square']} /><label htmlFor={this.props.facet.Name}><span> {this.props.facet.Name} </span>({this.props.facet.Count})</label>
                {this.renderList()}
            </li>
        );
    }
}
