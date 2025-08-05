// Dependencies
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { BreadcrumbList, HeadingText, GnShortcutButton } from "@kartverket/geonorge-web-components";

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
    const { searchData, params } = useRouteLoaderData("root");

    // Redux store
    const oidc = useSelector((state) => state.oidc);
    const environment = useSelector((state) => state.environment);
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    useEffect(() => {
        const isLoggedIn = !!oidc?.user?.access_token?.length;
        // Todo fix problem navigation from MainNavigationContainer https://medium.com/@fabrizio.azzarri/fixing-the-next-js-15-react-19-removechild-dom-error-a33b57cbc3b1
        if (isLoggedIn) {
            GnShortcutButton.setup("gn-shortcut-button", {
                getAuthToken: () => {
                    const token = oidc?.user?.access_token;
                    return token?.length ? token : null;
                }
            });
        }
    }, [oidc]);

    const renderSearchQuery = () => {
        let searchResultsText = "";
        const hasSearchResults = searchData?.results && Object.keys(searchData.results)?.length;
        const numFound = searchData?.results?.metadata?.NumFound || 0;
        if (!hasSearchResults) return <h1>Kartkatalogen</h1>;
        if (params.searchResultsType === "metadata") {
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
        } else if (params.searchResultsType === "articles") {
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

    const searchResultsTypeText = params.searchResultsType === "articles" ? "Artikkelsøk" : "Metadatasøk";

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
                <link rel="canonical" href={`${document.location.origin}/${params.searchResultsType || "metadata"}`} />
                <meta
                    name="description"
                    content="Bruk Geonorges kartkatalog til å søke etter, se på og laste ned norske offentlige kartdata"
                />
                <meta name="keywords" content="kartverket, geonorge, kartkatalog, kartkatalogen" />
            </Helmet>
            <breadcrumb-list id="breadcrumb-list" breadcrumbs={JSON.stringify(breadcrumbs)}></breadcrumb-list>
            <div id="main-content">
                <gn-shortcut-button language={selectedLanguage} environment={environment?.environment}></gn-shortcut-button>

                <header className={style.header}>
                    {searchData?.searchString?.length && searchData?.results ? (
                        renderSearchQuery()
                    ) : (
                        <heading-text>
                            <h1>Kartkatalogen</h1>
                        </heading-text>
                    )}
                    <ErrorBoundary>
                        <SelectedFacets searchData={searchData} searchResultsType={params.searchResultsType} />
                    </ErrorBoundary>
                </header>
                <ErrorBoundary>
                    <SearchResults searchData={searchData} searchResultsType={params.searchResultsType} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default Home;
