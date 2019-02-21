import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    fetchDropdownSearchResults
} from '../../../actions/SearchResultActions';
import { updateSearchString } from '../../../actions/SearchStringActions';
import { ErrorBoundary } from '../../ErrorBoundary'
import SearchResultsTypeList from './SearchResultsTypeList';

import style from './SearchBar.scss';
import searchIcon from '../../../images/svg/search-icon.svg';

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            showResults: false
        };
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showResults = this.showResults.bind(this);
    }

    hideDropdownResults() {
        this.setState({
            showResults: false
        });
    }

    showResults() {
        this.setState({
            showResults: true
        });
    }

    handleClick = (e) => {
        if (this.node && this.node.contains(e.target)) {
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
        this.showResults();
    }

    onSubmit(e) {
        e.preventDefault();
        this.hideDropdownResults();
        this.props.fetchMetadataSearchResults(this.state.searchString);
        this.props.fetchArticleSearchResults(this.state.searchString);
        this.props.updateSearchString(this.state.searchString);
    }

    componentWillMount() {
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
                        searchResultsType="dataset"/>
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
                        searchResultsType="service"/>
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
                        searchResultsType="software"/>
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
                        searchResultsType="articles"/>
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
        return (
            <form ref={node => this.node = node} autoComplete="off" onSubmit={this.onSubmit}
                className={style.searchInput}>
                <label htmlFor="searchString" className={style.mainSearchLabel}>Søk i kartkatalogen</label><input
                    placeholder="Søk etter kartdata og artikler" type="text" name="searchString" onChange={this.onChange} onFocus={this.onFocus}
                    value={this.state.searchString} id="searchString" />
                <button>
                    <img src={searchIcon} alt="search icon"></img>
                </button>
                <div className={this.state.showResults ? style.searchResults + ' active' : style.searchResults}>
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
    dropdownResults: state.searchResults.dropdownResults ? state.searchResults.dropdownResults : {}
});

const mapDispatchToProps = {
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    fetchDropdownSearchResults,
    updateSearchString
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
