// Dependencies
import React from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { GnButton } from "@kartverket/geonorge-web-components";

// Actions
import { getResource } from "actions/ResourceActions";

// Components
import MetadataSearchResult from "components/partials/SearchResults/MetadataSearchResult";
import ArticleSearchResult from "components/partials/SearchResults/ArticleSearchResult";
import { ErrorBoundary } from "components/ErrorBoundary";
import FacetFilter from "components/partials/FacetFilter";

// Stylesheets
import style from "components/partials/SearchResults.module.scss";

export const SearchResults = ({ searchData }) => {
    const dispatch = useDispatch();

    const getShowMoreLink = () => {
        const newOffset = searchData?.offset + 25;
        const activeSearchParameters = new URL(searchData?.request?.url)?.search || "";
        const urlParams = new URLSearchParams(activeSearchParameters);
        urlParams.set("offset", newOffset);
        urlParams.set("append", true);
        return `?${decodeURIComponent(urlParams.toString())}`;
    };

    const renderMetadataSearchResults = () => {
        const listItems = searchData?.results?.metadata?.Results;
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
        let listItems = searchData?.results?.articles?.Results;
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

    const renderShowMoreLink = () => {
        return (
            <div className={style.morecontainer}>
                <gn-button color="default">
                    <Link to={{ search: getShowMoreLink() }} replace className={style.morebtn}>
                        <span>{dispatch(getResource("ShowMoreResults", "Vis flere"))}</span>
                        <FontAwesomeIcon icon={"angle-down"} key="icon" />
                    </Link>
                </gn-button>
            </div>
        );
    };

    const renderActiveTabContent = () => {
        if (searchData?.selectedType === "metadata") {
            return (
                <div className={style.activeContent}>
                    <div className={style.facets}>
                        <ErrorBoundary key="facetFilter">
                            {<FacetFilter searchData={searchData} key="facetFilter" />}
                        </ErrorBoundary>
                    </div>
                    <div className={style.searchResultContainer}>
                        {renderMetadataSearchResults()}
                        <div className={style.downloadcsv}>
                            <a href={downloadAsCsvUrl()}>
                                {dispatch(getResource("SaveResultsAsCSV", "Lagre listen som CSV"))}
                            </a>
                        </div>
                        {searchData?.results?.metadata?.Offset < searchData?.results?.metadata?.NumFound
                            ? renderShowMoreLink()
                            : null}
                    </div>
                </div>
            );
        } else if (searchData?.selectedType === "articles") {
            return (
                <div className={style.searchResultContainer}>
                    {renderArticleSearchResults()}
                    {searchData?.results?.articles?.Offset < searchData?.results?.articles?.NumFound
                        ? renderShowMoreLink()
                        : null}
                </div>
            );
        } else {
            return null;
        }
    };

    return <div>{renderActiveTabContent()}</div>;
};

export default SearchResults;
