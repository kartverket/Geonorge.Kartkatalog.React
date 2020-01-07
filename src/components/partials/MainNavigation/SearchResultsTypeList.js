// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

// Actions
import { fetchMetadataSearchResults } from 'actions/SearchResultActions';
import { updateSelectedFacets } from 'actions/FacetFilterActions';
import { updateSelectedSearchResultsType } from 'actions/SelectedSearchResultsTypeActions';
import { updateSearchString } from 'actions/SearchStringActions';

// Reducers
import { pushToDataLayer } from 'reducers/TagManagerReducer';

// Helpers
import { getQueryStringFromFacets } from "helpers/FacetFilterHelpers";

// Stylesheets
import style from 'components/partials/MainNavigation/SearchResultsTypeList.module.scss';

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

    renderDropdownResultLink(result, resultType) {
        return resultType === 'articles'
            ? (
                <a onClick={this.handleSearchResultsClick} href={result.ShowDetailsUrl ? result.ShowDetailsUrl : '#'}>{result.Title}</a>
            ) : (
                <Link onClick={this.handleSearchResultsClick} to={`/metadata/${result.Uuid}`}>{result.Title}</Link>
            )
    }

    renderDropdownResults() {
        if (this.props.searchResults && this.props.searchResults.Results) {
            const resultsTypeElements = this.props.searchResults.Results.map((result, i) => {
                return (
                    <div className={style.searchResultsItem} key={i}>
                        {this.renderDropdownResultLink(result, this.props.searchResultsType)}
                    </div>
                );
            });
            return resultsTypeElements;
        }
    }

    showResults() {
        this.props.onShowResults();
    }

    handleSearchResultsClick = () => {
      this.props.pushToDataLayer({
				event: 'updateSearchString',
				category: 'metadataSearch',
				activity: 'dropDownResultsClick',
				searchString: this.props.searchString
			});
    }

    handleSearchResultsTypeClick = () => {
      this.props.pushToDataLayer({
				event: 'updateSearchString',
				category: 'metadataSearch',
				activity: 'dropDownResultsTypeClick',
				searchString: this.props.searchString
			});
      this.props.pushToDataLayer({
        event: 'updateSelectedFacets',
        category: 'facets',
        activity: 'addFacetType',
        facet: { NameTranslated: this.props.searchResults.TypeTranslated }
      });
    }

    render() {
        return (
            <div className={style.searchResultsSection} onClick={() => this.showResults()}>
                <div className={style.searchResultsSectionHeadingContainer}>
                    <Link to={{ pathname: `/${this.props.category}`, search: this.getUpdateFacetQueryString() }} onClick={this.handleSearchResultsTypeClick}>
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
    category: PropTypes.string.isRequired,
    searchResults: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    fetchMetadataSearchResults,
    updateSelectedFacets,
    updateSelectedSearchResultsType,
    updateSearchString,
    pushToDataLayer
};

export default connect(null, mapDispatchToProps)(SearchResultsTypeList);
