// Dependencies
import React from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { Link, useRouteLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { BreadcrumbList, HeadingText } from "@kartverket/geonorge-web-components";

// Actions
import { getResource } from "actions/ResourceActions";

// Components
import SelectedFacets from "components/partials/SelectedFacets";
import SearchResults from "components/partials/SearchResults";
import { ErrorBoundary } from "components/ErrorBoundary";

// Stylesheets
import style from "./Home.module.scss";

const Home = () => {
    const dispatch = useDispatch();
    const { searchData } = useRouteLoaderData("root");

    const renderSearchQuery = () => {
        let searchResultsText = "";
        const hasSearchResults = searchData?.results && Object.keys(searchData.results)?.length;
        const numFound = searchData?.results?.metadata?.NumFound || 0;
        if (!hasSearchResults) return <h1>Kartkatalogen</h1>;
        if (searchData?.selectedType === "metadata") {
            if (searchData?.searchString?.length && searchData?.results?.metadata) {
                const resourceVariables = [
                    searchData.searchString,
                    searchData.results.metadata.NumFound,
                    dispatch(getResource("MapCatalog", "Kartkatalogen"))
                ];
                searchResultsText =
                    numFound === 1
                        ? dispatch(
                              getResource("SearchResultCountText", "Søk på {0} ga {1} treff i {2}", resourceVariables)
                          )
                        : dispatch(
                              getResource("SearchResultsCountText", "Søk på {0} ga {1} treff i {2}", resourceVariables)
                          );
            }
            return (
                <div className={style.activeContent}>
                    <div className={style.searchResultContainer}>
                        <span className={searchData?.searchString !== "" ? style.searchResultInformation : ""}>
                            {searchResultsText}
                            <span className={searchData?.searchString !== "" ? style.show : style.hide}>
                                <Link to="/">
                                    {" "}
                                    {dispatch(getResource("ClearSearch", "Nullstill søk"))}
                                    <FontAwesomeIcon
                                        title={dispatch(getResource("ClearSearch", "Nullstill søk"))}
                                        className={style.resetSearchResults}
                                        icon={"times"}
                                    />
                                </Link>
                            </span>
                        </span>
                    </div>
                </div>
            );
        } else if (searchData?.selectedType === "articles") {
            const numFound = searchData?.results?.articles?.NumFound || 0;
            if (searchData?.searchString) {
                const resourceVariables = [
                    searchData?.searchString,
                    numFound,
                    dispatch(getResource("Articles", "Artikler"))
                ];
                searchResultsText =
                    numFound === 1
                        ? dispatch(
                              getResource("SearchResultCountText", "Søk på {0} ga {1} treff i {2}", resourceVariables)
                          )
                        : dispatch(
                              getResource("SearchResultsCountText", "Søk på {0} ga {1} treff i {2}", resourceVariables)
                          );
            }
            return (
                <div className={style.searchResultContainer}>
                    <span className={searchData?.searchString !== "" ? style.searchResultInformation : ""}>
                        {searchResultsText}
                        <span className={searchData?.searchString !== "" ? style.show : style.hide}>
                            <Link to="/">
                                {dispatch(getResource("ClearSearch", "Nullstill søk"))}
                                <FontAwesomeIcon
                                    title={dispatch(getResource("ClearSearch", "Nullstill søk"))}
                                    className={style.resetSearchResults}
                                    icon={"times"}
                                />
                            </Link>
                        </span>
                    </span>
                </div>
            );
        } else {
            return "";
        }
    };

    const searchResultsTypeText = searchData?.selectedType === "articles" ? "Artikkelsøk" : "Metadatasøk";

    const breadcrumbs = [
        {
            name: "Geonorge",
            url: "https://www.geonorge.no/"
        },
        {
            name: dispatch(getResource("AppPageTitle", "Kartkatalogen")),
            url: "/"
        }
    ];
    return (
        <div>
            <Helmet>
                <title>
                    {searchData?.searchString?.length
                        ? `${searchResultsTypeText} på '${searchData.searchString}' - `
                        : ""}
                    Kartkatalogen
                </title>
                <link rel="canonical" href={`${document.location.origin}/${searchData?.selectedType || "metadata"}`} />
                <meta
                    name="description"
                    content="Bruk Geonorges kartkatalog til å søke etter, se på og laste ned norske offentlige kartdata"
                />
                <meta name="keywords" content="kartverket, geonorge, kartkatalog, kartkatalogen" />
            </Helmet>
            <breadcrumb-list id="breadcrumb-list" breadcrumbs={JSON.stringify(breadcrumbs)}></breadcrumb-list>
            <div id="main-content">
                <div className={style.header}>
                    {searchData?.searchString?.length && searchData?.results ? (
                        renderSearchQuery()
                    ) : (
                        <heading-text>
                            <h1>Kartkatalogen</h1>
                        </heading-text>
                    )}
                    <ErrorBoundary>
                        <SelectedFacets searchData={searchData} />
                    </ErrorBoundary>
                </div>
                <ErrorBoundary>
                    <SearchResults searchData={searchData} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default Home;
