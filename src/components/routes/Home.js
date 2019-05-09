import React, { Component } from 'react';
import { connect } from 'react-redux';

import SearchResults from '../partials/SearchResults';
import { updateAvailableFacets, updateSelectedFacetsFromUrl } from '../../actions/FacetFilterActions'
import { updateSearchStringFromUrl } from '../../actions/SearchStringActions'
import { updateSelectedSearchResultsType } from '../../actions/SelectedSearchResultsTypeActions';


import { ErrorBoundary } from '../../components/ErrorBoundary'

import style from './Home.scss';
import { fetchMetadataSearchResults, fetchArticleSearchResults } from "../../actions/SearchResultActions";
import { Breadcrumb } from '../partials/Breadcrumb';

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
            }
        }
        )
        this.setSelectedSearchResultsType();
        this.props.fetchArticleSearchResults();
    }

    componentDidUpdate(prevProps) {
        const oldUrlParameterString = prevProps.router && prevProps.router.location && prevProps.router.location.search ? prevProps.router.location.search : '';
        const newUrlParameterString = this.props.router && this.props.router.location && this.props.router.location.search ? this.props.router.location.search : '';

        if (oldUrlParameterString !== newUrlParameterString) {
            const searchString = this.props.updateSearchStringFromUrl();
            const newSelectedFacets = this.props.updateSelectedFacetsFromUrl(this.props.availableFacets).payload;
            this.props.fetchMetadataSearchResults(searchString, newSelectedFacets).then(() => {
                let availableFacets = {};
                this.props.searchResults.metadata.Facets.forEach((facetFilterItem) => {
                    availableFacets[facetFilterItem.FacetField] = facetFilterItem;
                });
                this.props.updateAvailableFacets(availableFacets);
            });
            this.setSelectedSearchResultsType();
        }
    }

    render() {
        return (
            <div>
                <Breadcrumb />
                <div className={style.header}>
                    <h1>Kartkatalogen</h1>
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
    searchString: state.searchString
});

const mapDispatchToProps = {
    updateSelectedFacetsFromUrl,
    updateAvailableFacets,
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    updateSearchStringFromUrl,
    updateSelectedSearchResultsType
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
