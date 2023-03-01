// Dependencies
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { BreadcrumbList, HeadingText } from "@kartverket/geonorge-web-components";

// Actions
import { updateAvailableFacets, updateSelectedFacetsFromUrl } from "actions/FacetFilterActions";
import { updateSearchStringFromUrl } from "actions/SearchStringActions";
import { updateSelectedSearchResultsType } from "actions/SelectedSearchResultsTypeActions";
import { fetchMetadataSearchResults, fetchArticleSearchResults } from "actions/SearchResultActions";
import { clearMetadata } from "actions/MetadataActions";
import { getResource } from "actions/ResourceActions";

// Components
import SelectedFacets from "components/partials/SelectedFacets";
import SearchResults from "components/partials/SearchResults";
import { ErrorBoundary } from "components/ErrorBoundary";
import Breadcrumb from "components/partials/Breadcrumb";

// Stylesheets
import style from "./Home.module.scss";

const Home = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const [searchParams] = useSearchParams();

    const selectedCategory = params.category || "metadata";

    // Redux store
    const availableFacets = useSelector((state) => state.availableFacets);
    const searchResults = useSelector((state) => state.searchResults);
    const searchString = useSelector((state) => state.searchString);
    const selectedSearchResultsType = useSelector((state) => state.selectedSearchResultsType);
    const selectedLanguage = useSelector((state) => state.selectedLanguage);
    const selectedFacets = useSelector((state) => state.selectedFacets);

    // State
    const [hasAvailableFacets, setHasAvailableFacets] = useState(false);
    const [hasInitialSearchResults, setHasInitialSearchResults] = useState(false);

    const setSelectedCategory = () => {
        if (selectedCategory) {
            dispatch(updateSelectedSearchResultsType(selectedCategory));
        }
    };

    const getInitialSearchResults = () => {
        dispatch(fetchMetadataSearchResults(searchString));
        dispatch(fetchArticleSearchResults(searchString));
    };

    const getFacetFilteredSearchResults = () => {
        dispatch(fetchMetadataSearchResults(searchString, selectedFacets));
    };

    const getAvailableFacets = () => {
        let availableFacets = {};
        if (searchResults?.metadata?.Facets?.length) {
            searchResults.metadata.Facets.forEach((facetFilterItem) => {
                availableFacets[facetFilterItem.FacetField] = facetFilterItem;
            });
        }
        setHasAvailableFacets(true);
        return dispatch(updateAvailableFacets(availableFacets));
    };

    const setSelectedFacets = () => {
        dispatch(updateSelectedFacetsFromUrl(availableFacets)).payload;
    };

    useEffect(() => {
        setHasInitialSearchResults(false);
        setHasAvailableFacets(false);
    }, [selectedLanguage]);

    useEffect(() => {
        setSelectedCategory();
    }, [params]);

    useEffect(() => {
        const newSearchString = searchParams.get("text");
        if (searchString !== newSearchString) {
            setHasInitialSearchResults(false);
            setHasAvailableFacets(false);
            dispatch(updateSearchStringFromUrl(searchParams.get("text")));
        }
    }, [searchParams]);

    useEffect(() => {
        dispatch(clearMetadata());
        if (!hasAvailableFacets && !hasInitialSearchResults) {
            setHasInitialSearchResults(true);
            getInitialSearchResults();
        }
    }, [searchString, hasInitialSearchResults, hasAvailableFacets]);

    useEffect(() => {
        const hasMetadataSearchResults = searchResults?.metadata && Object.keys(searchResults.metadata)?.length;
        const hasArticlesSearchResults = searchResults?.articles && Object.keys(searchResults.articles)?.length;
        if (hasMetadataSearchResults && hasArticlesSearchResults) {
            getAvailableFacets();
        }
    }, [searchResults]);

    useEffect(() => {
        if (hasAvailableFacets) {
            setSelectedFacets();
        }
    }, [params, hasAvailableFacets]);

    useEffect(() => {
        const hasSelectedFacets =
            !!selectedFacets &&
            !!Object.keys(selectedFacets)?.length &&
            !!Object.keys(selectedFacets)?.filter((facetField) => {
                const facetFilterItem = selectedFacets[facetField];
                return !!facetFilterItem && !!Object.keys(facetFilterItem)?.length;
            })?.length;
        if (hasSelectedFacets) {
            getFacetFilteredSearchResults();
        }
    }, [selectedFacets]);

    const renderSearchQuery = () => {
        let searchResultsText = "";
        const hasSearchResults = searchResults && Object.keys(searchResults)?.length;
        if (!hasSearchResults) return <h1>Kartkatalogen</h1>;
        if (selectedSearchResultsType === "metadata") {
            if (searchString && searchResults?.metadata) {
                const resourceVariables = [
                    searchString,
                    searchResults.metadata.NumFound,
                    dispatch(getResource("MapCatalog", "Kartkatalogen"))
                ];
                searchResultsText =
                    searchResults.metadata.NumFound === 1
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
                        <span className={searchString !== "" ? style.searchResultInformation : ""}>
                            {searchResultsText}
                            <span className={searchString !== "" ? style.show : style.hide}>
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
        } else if (selectedSearchResultsType === "articles") {
            const numFound = searchResults?.articles?.NumFound || 0;
            if (searchString) {
                const resourceVariables = [searchString, numFound, dispatch(getResource("Articles", "Artikler"))];
                searchString =
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
                    <span className={searchString !== "" ? style.searchResultInformation : ""}>
                        {searchString}
                        <span className={searchString !== "" ? style.show : style.hide}>
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

    const searchResultsTypeText = selectedSearchResultsType === "articles" ? "Artikkelsøk" : "Metadatasøk";
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
                    {searchString?.length ? `${searchResultsTypeText} på '${searchString}' - ` : ""}
                    Kartkatalogen
                </title>
                <link rel="canonical" href={`${document.location.origin}/${selectedSearchResultsType || "metadata"}`} />
                <meta
                    name="description"
                    content="Bruk Geonorges kartkatalog til å søke etter, se på og laste ned norske offentlige kartdata"
                />
                <meta name="keywords" content="kartverket, geonorge, kartkatalog, kartkatalogen" />
            </Helmet>
            <breadcrumb-list id="breadcrumb-list" breadcrumbs={JSON.stringify(breadcrumbs)}></breadcrumb-list>
            <div className={style.header}>
                    {searchData?.searchString?.length && searchData?.results ? (
                        renderSearchQuery()
                    ) : (
                        <heading-text>
                            <h1>Kartkatalogen</h1>
                        </heading-text>
                    )}
                <ErrorBoundary>
                    <SelectedFacets />
                </ErrorBoundary>
            </div>
            <ErrorBoundary>
                <SearchResults />
            </ErrorBoundary>
        </div>
    );
};

export default Home;
