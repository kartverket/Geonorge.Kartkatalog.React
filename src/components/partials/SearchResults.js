// Dependencies
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { fetchMetadataSearchResults, fetchArticleSearchResults } from "actions/SearchResultActions";
import { getResource } from "actions/ResourceActions";

// Components
import MetadataSearchResult from "components/partials/SearchResults/MetadataSearchResult";
import ArticleSearchResult from "components/partials/SearchResults/ArticleSearchResult";
import { ErrorBoundary } from "components/ErrorBoundary";
import FacetFilter from 'components/partials/FacetFilter'

// Stylesheets
import style from "components/partials/SearchResults.module.scss";

export const SearchResults = () => {
    const dispatch = useDispatch();

    // Redux store
    const searchResults = useSelector((state) => state.searchResults);
    const selectedSearchResultsType = useSelector((state) => state.selectedSearchResultsType);
    const selectedFacets = useSelector((state) => state.selectedFacets);
    const searchString = useSelector((state) => state.searchString);

    const moreItemsAvailable = () => {
        if (searchResults.metadata) {
            const numberOfRequestedItems = searchResults.metadata.Limit + (searchResults.metadata.Offset - 1);
            if (searchResults.metadata.NumFound > numberOfRequestedItems) {
                return true;
            }
        }
        return false;
    };

    const moreArticlesAvailable = () => {
        if (searchResults.articles) {
            const numberOfRequestedItems = searchResults.articles.Limit + (searchResults.articles.Offset - 1);
            if (searchResults.articles.NumFound > numberOfRequestedItems) {
                return true;
            }
        }
        return false;
    };

    const addMoreMetadataToSearchResult = () => {
        dispatch(fetchMetadataSearchResults(searchString, selectedFacets, searchResults.metadata.Offset + 25, true));
        renderActiveTabContent();
    };

    const addMoreArticlesToSearchResult = () => {
        dispatch(fetchArticleSearchResults("", searchResults.articles.Offset + 25, true));
        renderActiveTabContent();
    };

    const renderMetadataSearchResults = () => {
        const listItems = searchResults?.metadata?.Results;
        if (listItems?.length) {
            let listItemElements = listItems.map((searchResult, i) => {
                return (
                    <ErrorBoundary key={i}>
                        <MetadataSearchResult
                            searchResult={searchResult}
                            visibleFields={["DownloadButton", "MapButton", "ApplicationButton"]}
                            key={i}
                        />
                    </ErrorBoundary>
                );
            });
            return React.createElement("div", { className: style.list, key: "searchResult" }, listItemElements);
        } else {
            return null;
        }
    };

    const renderArticleSearchResults = () => {
        let listItems = searchResults?.articles?.Results;
        if (listItems?.length) {
            let listItemElements = listItems.map((searchResult, i) => {
                return (
                    <ErrorBoundary key={i}>
                        <ArticleSearchResult searchResult={searchResult} key={i} />
                    </ErrorBoundary>
                );
            });
            return React.createElement("div", { className: style.list }, listItemElements);
        } else {
            return "";
        }
    };

    const downloadAsCsvUrl = () => {
        return localStorage.getItem("urlDownloadCsv");
    };

    const renderActiveTabContent = () => {
        if (selectedSearchResultsType === "metadata") {
            const moreItemButtonClassNames = classNames({
                [style.morebtn]: true,
                hidden: !moreItemsAvailable()
            });
            return (
                <div className={style.activeContent}>
                    <div className={style.facets}>
                        <ErrorBoundary key="facetFilter">{<FacetFilter key="facetFilter" />}</ErrorBoundary>
                    </div>
                    <div className={style.searchResultContainer}>
                        {renderMetadataSearchResults()}
                        <div className={style.downloadcsv}>
                            <a href={downloadAsCsvUrl()}>
                                {dispatch(getResource("SaveResultsAsCSV", "Lagre listen som CSV"))}
                            </a>
                        </div>
                        {
                            searchResults?.metadata?.Offset < searchResults?.metadata?.NumFound
                            ? (
                                <div className={style.morecontainer}>
                                    <div className={moreItemButtonClassNames} onClick={() => addMoreMetadataToSearchResult()}>
                                        <span>{dispatch(getResource("ShowMoreResults", "Vis flere"))}</span>
                                        <FontAwesomeIcon icon={"angle-down"} key="icon" />
                                    </div>
                                </div>
                            )
                            : null
                        }
                    </div>
                </div>
            );
        } else if (selectedSearchResultsType === "articles") {
            const moreItemButtonClassNames = classNames({
                [style.morebtn]: true,
                hidden: !moreArticlesAvailable()
            });
            return (
                <div className={style.searchResultContainer}>
                    {renderArticleSearchResults()}
                    {
                        searchResults?.articles?.Offset < searchResults?.articles?.NumFound
                        ? (
                            <div className={style.morecontainer}>
                                <div className={moreItemButtonClassNames} onClick={() => addMoreArticlesToSearchResult()}>
                                    <span>{dispatch(getResource("ShowMoreResults", "Vis flere"))}</span>
                                    <FontAwesomeIcon icon={"angle-down"} key="icon" />
                                </div>
                            </div>
                        )
                        : null
                    }                    
                </div>
            );
        } else {
            return null;
        }
    };

    return <div>{renderActiveTabContent()}</div>;
};

export default SearchResults;
