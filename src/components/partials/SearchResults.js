// Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { fetchMetadataSearchResults, fetchArticleSearchResults } from '../../actions/SearchResultActions';
import { getResource } from '../../actions/ResourceActions'

// Components
import MetadataSearchResult from './SearchResults/MetadataSearchResult'
import ArticleSearchResult from './SearchResults/ArticleSearchResult'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import FacetFilter from './FacetFilter'

// Stylesheets
import style from './SearchResults.scss';


class SearchResults extends Component {

    moreItemsAvailable() {
        if (this.props.searchResults.metadata) {
            const numberOfRequestedItems = this.props.searchResults.metadata.Limit + (this.props.searchResults.metadata.Offset - 1);
            if (this.props.searchResults.metadata.NumFound > numberOfRequestedItems) {
                return true
            }
        }
        return false;
    }

    moreArticlesAvailable() {
        if (this.props.searchResults.articles) {
            const numberOfRequestedItems = this.props.searchResults.articles.Limit + (this.props.searchResults.articles.Offset - 1);
            if (this.props.searchResults.articles.NumFound > numberOfRequestedItems) {
                return true
            }
        }
        return false;
    }

    addMoreMetadataToSearchResult() {
        this.props.fetchMetadataSearchResults(this.props.searchString, this.props.selectedFacets, this.props.searchResults.metadata.Offset + 25, true)
        this.renderActiveTabContent()
    }

    addMoreArticlesToSearchResult() {
        this.props.fetchArticleSearchResults("", this.props.searchResults.articles.Offset + 25, true);
        this.renderActiveTabContent()
    }

    renderMetadataSearchResults() {
        let listItems = this.props.searchResults.metadata && this.props.searchResults.metadata.Results ? this.props.searchResults.metadata.Results : null;
        if (listItems) {
            let listItemElements = listItems.map((searchResult, i) => {
                return (
                    <ErrorBoundary key={i}>
                        <MetadataSearchResult searchResult={searchResult} visibleFields={['DownloadButton', 'MapButton', 'ApplicationButton']} key={i} />
                    </ErrorBoundary>
                );
            });
            return React.createElement('div', { className: style.list, key: "searchResult" }, listItemElements);
        } else {
            return "";
        }
    }

    renderArticleSearchResults() {
        let listItems = this.props.searchResults.articles && this.props.searchResults.articles.Results ? this.props.searchResults.articles.Results : null;
        if (listItems) {
            let listItemElements = listItems.map((searchResult, i) => {
                return (
                    <ErrorBoundary key={i}>
                        <ArticleSearchResult searchResult={searchResult} key={i} />
                    </ErrorBoundary>
                );
            });
            return React.createElement('div', { className: style.list }, listItemElements);
        } else {
            return "";
        }
    }

    downloadAsCsvUrl() {
        return localStorage.getItem('urlDownloadCsv');
    }

    renderActiveTabContent() {
        let searchString = "";
        if (this.props.selectedSearchResultsType === 'metadata') {
            const moreItemButtonClassNames = classNames({
                [style.morebtn]: true,
                hidden: !this.moreItemsAvailable()
            });

            if (this.props.searchString && this.props.searchResults && this.props.searchResults.metadata && this.props.searchResults.metadata.NumFound) {
                searchString = this.props.searchResults.metadata.NumFound === 1
                    ? this.props.getResource('SearchResultCountText', 'Søk på {0} ga {1} treff', [this.props.searchString, this.props.searchResults.metadata.NumFound])
                    : this.props.getResource('SearchResultsCountText', 'Søk på {0} ga {1} treff', [this.props.searchString, this.props.searchResults.metadata.NumFound]);
            }
            return (
                <div className={style.activeContent}>
                    <div className={style.facets}>
                        <ErrorBoundary key="facetFilter">
                            <FacetFilter key="facetFilter" />
                        </ErrorBoundary>
                    </div>
                    <div className={style.searchResultContainer}>

                        <span className={searchString !== "" ? style.searchResultInformation : ""}>{searchString}
                            <span className={searchString !== "" ? 'show' : 'hide'}>
                                <Link to="/"> {this.props.getResource('ClearSearch', 'Nullstill søk')}
                                    <FontAwesomeIcon title={this.props.getResource('ClearSearch', 'Nullstill søk')} className={style.resetSearchResults} icon={'times'} />
                                </Link>
                            </span>
                        </span>
                        {this.renderMetadataSearchResults()}
                        <div className={style.downloadcsv}>
                            <a href={this.downloadAsCsvUrl()}>
                                {this.props.getResource('SaveResultsAsCSV', 'Lagre listen som CSV')}
                            </a>
                        </div>
                        <div className={style.morecontainer}>
                            <div className={moreItemButtonClassNames} onClick={() => this.addMoreMetadataToSearchResult()}>
                                <span>
                                    {this.props.getResource('ShowMoreResults', 'Vis flere')}
                                </span>
                                <FontAwesomeIcon icon={'angle-down'} key="icon" />
                            </div>
                        </div>
                    </div>
                </div>
            )

        } else if (this.props.selectedSearchResultsType === 'articles') {
            if (this.props.searchString) {
                searchString = this.props.searchResults.articles.NumFound === 1
                    ? this.props.getResource('SearchResultCountText', 'Søk på {0} ga {1} treff', [this.props.searchString, this.props.searchResults.articles.NumFound])
                    : this.props.getResource('SearchResultsCountText', 'Søk på {0} ga {1} treff', [this.props.searchString, this.props.searchResults.articles.NumFound]);
            }
            const moreItemButtonClassNames = classNames({
                [style.morebtn]: true,
                hidden: !this.moreArticlesAvailable()
            });
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
                    {this.renderArticleSearchResults()}
                    <div className={style.morecontainer}>
                        <div className={moreItemButtonClassNames} onClick={() => this.addMoreArticlesToSearchResult()}>
                            <span>{this.props.getResource('ShowMoreResults', 'Vis flere')}</span>
                            <FontAwesomeIcon icon={'angle-down'} key="icon" />
                        </div>
                    </div>
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
                {this.renderActiveTabContent()}
            </div>
        );
    }
}

SearchResults.propTypes = {
    searchResults: PropTypes.object.isRequired,
    selectedSearchResultsType: PropTypes.string.isRequired,
    fetchMetadataSearchResults: PropTypes.func.isRequired,
    fetchArticleSearchResults: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    searchResults: state.searchResults,
    selectedSearchResultsType: state.selectedSearchResultsType,
    selectedFacets: state.selectedFacets,
    searchString: state.searchString,
    resources: state.resources
});

const mapDispatchToProps = {
    fetchMetadataSearchResults,
    fetchArticleSearchResults,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);