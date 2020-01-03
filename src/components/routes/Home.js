// Dependencies
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { updateAvailableFacets, updateSelectedFacetsFromUrl, addSelectedFacetsToAnalytics } from '../../actions/FacetFilterActions'
import { updateSearchStringFromUrl } from '../../actions/SearchStringActions'
import { updateSelectedSearchResultsType } from '../../actions/SelectedSearchResultsTypeActions';
import { fetchMetadataSearchResults, fetchArticleSearchResults } from "../../actions/SearchResultActions";
import { clearMetadata } from '../../actions/MetadataActions'
import { getResource } from '../../actions/ResourceActions'

// Components
import SelectedFacets from '../partials/SelectedFacets';
import SearchResults from '../partials/SearchResults';
import { ErrorBoundary } from '../../components/ErrorBoundary'
import Breadcrumb from '../partials/Breadcrumb';

// Stylesheets
import style from './Home.scss';

class Home extends Component {
    setSelectedSearchResultsType() {
        const searchResultsTypeRegex = /type=articles/i;
        const searchResultsType = searchResultsTypeRegex.exec(window.location.search) !== null ? 'articles' : 'metadata';
        this.props.updateSelectedSearchResultsType(searchResultsType);
    }

    setSelectedCategory() {
        const selectedCategory = this.props && this.props.match && this.props.match.params && this.props.match.params.category ? this.props.match.params.category : null;
        if (selectedCategory) {
            this.props.updateSelectedSearchResultsType(this.props.match.params.category);
        }
    }

    componentDidMount() {
        this.props.clearMetadata();
        this.setSelectedCategory();
        this.props.fetchMetadataSearchResults("", this.props.selectedFacets).then(() => {
            let availableFacets = {};
            if (this.props.searchResults && this.props.searchResults.metadata && this.props.searchResults.metadata.Facets && this.props.searchResults.metadata.Facets.length) {
                this.props.searchResults.metadata.Facets.forEach((facetFilterItem) => {
                    availableFacets[facetFilterItem.FacetField] = facetFilterItem;
                });
            }
            this.props.updateAvailableFacets(availableFacets);

            if (window.location.search) { // TODO Check if location.search contains facets
                const selectedFacets = this.props.updateSelectedFacetsFromUrl(availableFacets).payload;
                this.props.addSelectedFacetsToAnalytics(selectedFacets);
                this.props.updateSearchStringFromUrl();
                this.props.fetchMetadataSearchResults(this.props.searchString, selectedFacets);
                this.props.fetchArticleSearchResults(this.props.searchString);
            }
        });
        this.setSelectedSearchResultsType();
        this.props.fetchArticleSearchResults(this.props.searchString);
    }

    componentDidUpdate(prevProps) {
        this.setSelectedCategory();
        const oldUrlParameterString = prevProps.router && prevProps.router.location && prevProps.router.location.search ? prevProps.router.location.search : '';
        const newUrlParameterString = this.props.router && this.props.router.location && this.props.router.location.search ? this.props.router.location.search : '';

        const urlParameterStringHasChanged = oldUrlParameterString !== newUrlParameterString;
        const selectedLanguageHasChanged = prevProps.selectedLanguage !== this.props.selectedLanguage;

        const metadataResultsFound = prevProps.searchResults && prevProps.searchResults.metadata && prevProps.searchResults.metadata.NumFound ? prevProps.searchResults.metadata.NumFound : null;
        const prevMetadataResultsFound = this.props.searchResults && this.props.searchResults.metadata && this.props.searchResults.metadata.NumFound ? this.props.searchResults.metadata.NumFound : null;
        const metadataResultsFoundHasChanged = metadataResultsFound !== prevMetadataResultsFound;

        const componentShouldFetch = urlParameterStringHasChanged || selectedLanguageHasChanged || metadataResultsFoundHasChanged;

        if (componentShouldFetch) {
            const searchString = this.props.updateSearchStringFromUrl();
            const selectedFacets = this.props.updateSelectedFacetsFromUrl(this.props.availableFacets).payload;
            this.props.fetchMetadataSearchResults(searchString, selectedFacets).then(() => {
                let availableFacets = {};
                if (this.props.searchResults && this.props.searchResults.metadata && this.props.searchResults.metadata.Facets && this.props.searchResults.metadata.Facets.length) {
                    this.props.searchResults.metadata.Facets.forEach((facetFilterItem) => {
                        availableFacets[facetFilterItem.FacetField] = facetFilterItem;
                    });
                }
                const newSelectedFacets = this.props.updateSelectedFacetsFromUrl(availableFacets).payload;
                this.props.fetchMetadataSearchResults(searchString, newSelectedFacets).then(() => {
                    this.props.updateAvailableFacets(availableFacets);
                });
            });
            this.props.fetchArticleSearchResults(searchString);
            this.setSelectedSearchResultsType();
        }
    }

    renderSearchQuery() {
        let searchString = "";
        const hasSearchResults = this.props.searchResults && Object.keys(this.props.searchResults).length;
        if (!hasSearchResults) return (<h1>Kartkatalogen</h1>);
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
                    this.props.searchResults.articles.NumFound,
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
      const searchResultsTypeText = this.props.selectedSearchResultsType === 'articles' ? 'Artikkelsøk' : 'Metadatasøk';
        return (
            <div>
                <Helmet>
                    <title>{this.props.searchString && this.props.searchString.length ? `${searchResultsTypeText} på '${this.props.searchString}' - ` : '' }Kartkatalogen</title>
                    <link rel="canonical" href={`${document.location.origin}/${this.props.selectedSearchResultsType ? this.props.selectedSearchResultsType : 'metadata'}`} />
                    <meta name="description" content='Bruk Geonorges kartkatalog til å søke etter, se på og laste ned norske offentlige kartdata' />
                    <meta name="keywords" content="kartverket, geonorge, kartkatalog, kartkatalogen" />
                </Helmet>
                <Breadcrumb content={this.props.searchString && this.props.searchString.length ? `${searchResultsTypeText} på '${this.props.searchString}'` : null} />
                <div className={style.header}>
                    {this.props.searchString && this.props.searchResults ? this.renderSearchQuery() : <h1>Kartkatalogen</h1>}
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
    addSelectedFacetsToAnalytics,
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    updateSearchStringFromUrl,
    updateSelectedSearchResultsType,
    clearMetadata,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
