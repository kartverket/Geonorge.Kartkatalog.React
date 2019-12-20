// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

// Actions
import {
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    fetchDropdownSearchResults
} from '../../../actions/SearchResultActions';
import { updateSearchString } from '../../../actions/SearchStringActions';
import { getResource } from '../../../actions/ResourceActions'

// Reducers
import { pushToDataLayer } from '../../../reducers/TagManagerReducer';

// Components
import { ErrorBoundary } from '../../ErrorBoundary'
import SearchResultsTypeList from './SearchResultsTypeList';

// Stylesheets
import style from './SearchBar.scss';

// Assets
import searchIcon from '../../../images/svg/search-icon.svg';

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            showDropdownResults: false
        };
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.showDropdownResults = this.showDropdownResults.bind(this);
        this.hideDropdownResults = this.hideDropdownResults.bind(this);
        this.keyPress = this.keyPress.bind(this);
    }

    hideDropdownResults() {
        this.setState({
            showDropdownResults: false
        });
    }

    showDropdownResults() {
        this.setState({
            showDropdownResults: true
        });
    }

    handleClick = (e) => {
        if (this.node && this.node.contains(e.target)) {
            this.showDropdownResults();
            return;
        }
        this.hideDropdownResults();
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        this.props.fetchDropdownSearchResults(e.target.value);
    }

    onFocus(e) {
        this.showDropdownResults();
    }

    keyPress(e) {
        if (e.keyCode === 13) { // On 'enter' keypress
          this.hideDropdownResults();
        }
    }

    handleSearchButtonClick = () => {
      this.props.pushToDataLayer({
				event: 'updateSearchString',
				category: 'metadataSearch',
				activity: 'submitSearch',
				searchString: this.state.searchString
			});
      this.hideDropdownResults();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }


    renderDropdownResults() {

        if (this.props.dropdownResults && Object.keys(this.props.dropdownResults).length) {
            let hasResults = false;

            // Dataset
            let datasetSearchResult = this.props.dropdownResults.dataset;
            let datasetList
            if (datasetSearchResult && datasetSearchResult.NumFound) {
                hasResults = true;
                datasetList = <ErrorBoundary key={"dataset"}>
                    <SearchResultsTypeList onShowResults={() => this.hideDropdownResults()}
                        searchString={this.state.searchString} searchResults={datasetSearchResult}
                        searchResultsType="dataset" category="metadata" />
                </ErrorBoundary>
            }

            // Service
            let serviceSearchResult = this.props.dropdownResults.service;
            let serviceList;
            if (serviceSearchResult && serviceSearchResult.NumFound) {
                hasResults = true;
                serviceList = <ErrorBoundary key={"service"} >
                    <SearchResultsTypeList onShowResults={() => this.hideDropdownResults()}
                        searchString={this.state.searchString} searchResults={serviceSearchResult}
                        searchResultsType="service" category="metadata" />
                </ErrorBoundary>
            }

            // Software
            let softwareSearchResult = this.props.dropdownResults.software;
            let softwareList;
            if (softwareSearchResult && softwareSearchResult.NumFound) {
                hasResults = true;
                softwareList = <ErrorBoundary key={"software"}>
                    <SearchResultsTypeList onShowResults={() => this.hideDropdownResults()}
                        searchString={this.state.searchString} searchResults={softwareSearchResult}
                        searchResultsType="software" category="metadata" />
                </ErrorBoundary>
            }

            // Articles
            let articlesSearchResult = this.props.dropdownResults.articles;
            let articlesList;
            if (articlesSearchResult && articlesSearchResult.NumFound) {
                hasResults = true;
                articlesList = <ErrorBoundary key={"articles"}>
                    <SearchResultsTypeList onShowResults={() => this.hideDropdownResults()}
                        searchString={this.state.searchString} searchResults={articlesSearchResult}
                        searchResultsType="articles" category="articles" />
                </ErrorBoundary>
            }

            let resultsTypeElements = [datasetList, serviceList, softwareList, articlesList]

            if (!hasResults) {
                return <div>Ingen treff for {this.state.searchString}</div>;
            }
            return resultsTypeElements;
        }
    }

    render() {
        const dropDownResultsStyle = {
            maxHeight: `${window.innerHeight - 62}px`
        };
        const selectedCategory = this.props.selectedSearchResultsType ? this.props.selectedSearchResultsType : 'metadata';
        return (
            <form ref={node => this.node = node} autoComplete="off"
                className={style.searchInput}>
                <label htmlFor="searchString" className={style.mainSearchLabel}>Søk i kartkatalogen</label>
                <input
                    placeholder={this.props.getResource('SearchMapDataAndArticles', 'Søk etter kartdata og artikler')}
                    type="text"
                    name="searchString"
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onKeyDown={this.keyPress}
                    value={this.state.searchString} id="searchString" />

                <Link to={{ pathname: `/${selectedCategory}`, search: '?text=' + this.state.searchString }} onClick={this.handleSearchButtonClick}>
                    <button>
                        <img src={searchIcon} alt="search icon"></img>
                    </button>
                </Link>
                <div className={this.state.showDropdownResults ? style.searchResults + ' active' : style.searchResults} style={dropDownResultsStyle}>
                    {this.renderDropdownResults()}
                </div>
            </form>
        )
    }
}

SearchBar.propTypes = {
    fetchMetadataSearchResults: PropTypes.func.isRequired,
    fetchArticleSearchResults: PropTypes.func.isRequired,
    fetchDropdownSearchResults: PropTypes.func.isRequired,
    dropdownResults: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    dropdownResults: state.searchResults.dropdownResults ? state.searchResults.dropdownResults : {},
    selectedSearchResultsType: state.selectedSearchResultsType,
    resources: state.resources
});

const mapDispatchToProps = {
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    fetchDropdownSearchResults,
    updateSearchString,
    getResource,
    pushToDataLayer
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
