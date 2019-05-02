import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {fetchMetadataSearchResults} from '../../../actions/SearchResultActions';
import {updateSelectedFacets} from '../../../actions/FacetFilterActions';
import {updateSelectedSearchResultsType} from '../../../actions/SelectedSearchResultsTypeActions';
import {updateSearchString} from '../../../actions/SearchStringActions';
import {getQueryStringFromFacets} from "../../../helpers/FacetFilterHelpers";

import style from './SearchResultsTypeList.scss';

class SearchResultsTypeList extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    getUpdateFacetQueryString() {
        return getQueryStringFromFacets(
            {
                type: {
                    Name: 'type',
                    facets: {
                        [this.props.searchResultsType]: {
                            Name: this.props.searchResultsType
                        }
                    }
                }
            },
            this.props.searchString
        );
    }

    renderDropdownResults() {
        if (this.props.searchResults && this.props.searchResults.Results) {
            const resultsTypeElements = this.props.searchResults.Results.map((result, i) => {
                return (
                    <div className={style.searchResultsItem} key={i}>
                        <Link to={`/metadata/${result.Uuid}`}>{result.Title}</Link>
                    </div>
                );
            });
            return resultsTypeElements;
        }
    }

    showResults() {
        this.props.onShowResults();
    }

    render() {
        return ( 
            <div className={style.searchResultsSection} onClick={() => this.showResults()}>
                <div className={style.searchResultsSectionHeadingContainer}>
                    <Link to={{pathname: '/', search: this.getUpdateFacetQueryString()}}>
                        <span
                            className={style.searchResultsSectionHeading}>{this.props.searchResults.TypeTranslated}</span>
                        <span className={style.counter}> {this.props.searchResults.NumFound}</span>
                    </Link>
                </div>
                {this.renderDropdownResults()}
            </div>
        )
    }
}

SearchResultsTypeList.propTypes = {
    searchString: PropTypes.string.isRequired,
    searchResultsType: PropTypes.string.isRequired,
    searchResults: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    fetchMetadataSearchResults,
    updateSelectedFacets,
    updateSelectedSearchResultsType,
    updateSearchString
};

export default connect(null, mapDispatchToProps)(SearchResultsTypeList);
