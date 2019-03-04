import React, {Component} from 'react';
import {connect} from 'react-redux';

import SearchResults from '../partials/SearchResults';
import {updateAvailableFacets, updateSelectedFacetsFromUrl} from '../../actions/FacetFilterActions'
import {updateSearchStringFromUrl} from '../../actions/SearchStringActions'

import {ErrorBoundary} from '../../components/ErrorBoundary'

import style from './Home.scss';
import {fetchMetadataSearchResults} from "../../actions/SearchResultActions";

class Home extends Component {
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

    }


    componentDidUpdate(prevProps) {
        if (prevProps.router.location && this.props.router.location.search !== prevProps.router.location.search) {
            this.props.updateSelectedFacetsFromUrl(this.props.availableFacets);
            this.props.updateSearchStringFromUrl();
            this.props.fetchMetadataSearchResults("", this.props.selectedFacets).then(() => {
                let availableFacets = {};
                this.props.searchResults.metadata.Facets.forEach((facetFilterItem) => {
                    availableFacets[facetFilterItem.FacetField] = facetFilterItem;
                });
                this.props.updateAvailableFacets(availableFacets);
            });

        }
    }

    render() {
        return (
            <div>
                <div className={style.header}>
                    <h1>Kartkatalogen</h1>
                </div>
                <ErrorBoundary><SearchResults/></ErrorBoundary>
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
    updateSearchStringFromUrl
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
