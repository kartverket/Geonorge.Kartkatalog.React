import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectedFacets from '../partials/SelectedFacets';

import SearchResults from '../partials/SearchResults';
import { updateAvailableFacets, updateSelectedFacetsFromUrl } from '../../actions/FacetFilterActions'
import { updateSearchStringFromUrl } from '../../actions/SearchStringActions'
import { updateSelectedSearchResultsType } from '../../actions/SelectedSearchResultsTypeActions';
import { getResource } from '../../actions/ResourceActions'

import { ErrorBoundary } from '../../components/ErrorBoundary'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Home.scss';
import { fetchMetadataSearchResults, fetchArticleSearchResults } from "../../actions/SearchResultActions";
import Breadcrumb from '../partials/Breadcrumb';

class Home extends Component {
    setSelectedSearchResultsType() {
        const searchResultsTypeRegex = /type=articles/i;
        const searchResultsType = searchResultsTypeRegex.exec(window.location.search) !== null ? 'articles' : 'metadata';
        this.props.updateSelectedSearchResultsType(searchResultsType);
    }

    componentDidMount() {
        this.props.fetchMetadataSearchResults("", this.props.selectedFacets).then(() => {
            let availableFacets = {};
            this.props.searchResults.metadata.Facets.forEach((facetFilterItem) => {
                availableFacets[facetFilterItem.FacetField] = facetFilterItem;
            });
            this.props.updateAvailableFacets(availableFacets);
            if (window.location.search) { // TODO Check if location.search contains facets
                this.props.updateSelectedFacetsFromUrl(this.props.availableFacets);
                this.props.updateSearchStringFromUrl();
                this.props.fetchMetadataSearchResults(this.props.searchString, this.props.selectedFacets);
                this.props.fetchArticleSearchResults(this.props.searchString);
            }
        }
        )
        this.setSelectedSearchResultsType();
        this.props.fetchArticleSearchResults(this.props.searchString);
    }

    componentDidUpdate(prevProps) {
        const oldUrlParameterString = prevProps.router && prevProps.router.location && prevProps.router.location.search ? prevProps.router.location.search : '';
        const newUrlParameterString = this.props.router && this.props.router.location && this.props.router.location.search ? this.props.router.location.search : '';

        const urlParameterStringHasChanged = oldUrlParameterString !== newUrlParameterString;
        const selectedLanguageHasChanged = prevProps.selectedLanguage !== this.props.selectedLanguage;


        const componentShouldFetch = urlParameterStringHasChanged || selectedLanguageHasChanged;


        if (componentShouldFetch) {
            const searchString = this.props.updateSearchStringFromUrl();
            const newSelectedFacets = this.props.updateSelectedFacetsFromUrl(this.props.availableFacets).payload;
            this.props.fetchMetadataSearchResults(searchString, newSelectedFacets).then(() => {
                let availableFacets = {};
                this.props.searchResults.metadata.Facets.forEach((facetFilterItem) => {
                    availableFacets[facetFilterItem.FacetField] = facetFilterItem;
                });
                this.props.updateAvailableFacets(availableFacets);
            });
            this.props.fetchArticleSearchResults(searchString);
            this.setSelectedSearchResultsType();
        }

        if (prevProps.selectedLanguage !== this.props.selectedLanguage) {
            this.render();
        }
    }
    renderSearchQuery() {
        let searchString = "";
        if (this.props.selectedSearchResultsType === 'metadata') {
            if (this.props.searchString && this.props.searchResults && this.props.searchResults.metadata) {
                const resourceVariables = [
                    this.props.searchString,
                    this.props.searchResults.metadata.NumFound,
                    this.props.getResource('MapCatalog', 'Kartkatalogen')
                ]
                searchString = this.props.searchResults.metadata.NumFound === 1
                    ? this.props.getResource('SearchResultCountText', 'Søk på {0} ga {1} treff i {2}', resourceVariables)
                    : this.props.getResource('SearchResultsCountText', 'Søk på {0} ga {1} treff i {2}', resourceVariables);
            }
            return (
                <div className={style.activeContent}>
                    <div className={style.searchResultContainer}>

                        <span className={searchString !== "" ? style.searchResultInformation : ""}>{searchString}
                            <span className={searchString !== "" ? 'show' : 'hide'}>
                                <Link to="/"> {this.props.getResource('ClearSearch', 'Nullstill søk')}
                                    <FontAwesomeIcon title={this.props.getResource('ClearSearch', 'Nullstill søk')} className={style.resetSearchResults} icon={'times'} />
                                </Link>
                            </span>
                        </span>
                    </div>
                </div>
            )

        } else if (this.props.selectedSearchResultsType === 'articles') {
            if (this.props.searchString) {
                const resourceVariables = [
                    this.props.searchString,
                    this.props.searchResults.metadata.NumFound,
                    this.props.getResource('Articles', 'Artikler')
                ]
                searchString = this.props.searchResults.articles.NumFound === 1
                    ? this.props.getResource('SearchResultCountText', 'Søk på {0} ga {1} treff i {2}', resourceVariables)
                    : this.props.getResource('SearchResultsCountText', 'Søk på {0} ga {1} treff i {2}', resourceVariables);
            }
            return (
                <div className={style.searchResultContainer}>
                    <span className={searchString !== "" ? style.searchResultInformation : ""}>
                        {searchString}
                        <span className={searchString !== "" ? 'show' : 'hide'}>
                            <Link to="/">
                                {this.props.getResource('ClearSearch', 'Nullstill søk')}
                                <FontAwesomeIcon title={this.props.getResource('ClearSearch', 'Nullstill søk')} className={style.resetSearchResults} icon={'times'} />
                            </Link>
                        </span>
                    </span>
                </div>
            );
        } else {
            return (
                ""
            )
        }
    }

    render() {
        return (
            <div>
                <Breadcrumb />
                <div className={style.header}>
                    {this.props.searchString ? this.renderSearchQuery() : <h1>Kartkatalogen</h1>}
                    <ErrorBoundary><SelectedFacets /></ErrorBoundary>
                </div>
                <ErrorBoundary><SearchResults /></ErrorBoundary>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    router: state.router,
    availableFacets: state.availableFacets,
    selectedFacets: state.selectedFacets,
    searchResults: state.searchResults,
    searchString: state.searchString,
    selectedSearchResultsType: state.selectedSearchResultsType,
    selectedLanguage: state.selectedLanguage
});

const mapDispatchToProps = {
    updateSelectedFacetsFromUrl,
    updateAvailableFacets,
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    updateSearchStringFromUrl,
    updateSelectedSearchResultsType,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
