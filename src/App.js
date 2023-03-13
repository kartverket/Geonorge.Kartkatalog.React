// Dependencies
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { OidcProvider } from "redux-oidc";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Utils
import configureStore from "utils/configureStore";
import userManagerPromise from "utils/userManager";

// Actions
import { fetchResources } from "actions/ResourceActions";
import { fetchSelectedLanguage } from "actions/SelectedLanguageActions";
import { getEnvironment } from "actions/EnvironmentActions";
import { fetchAvailableWFSServiceStatuses, fetchAvailableWMSServiceStatuses } from "actions/ServiceStatusActions";
import { fetchArticleSearchResults, fetchMetadataSearchResults } from "actions/SearchResultActions";
import { updateSelectedSearchResultsType } from "actions/SelectedSearchResultsTypeActions";
import {
    updateAvailableFacets,
    updateExpandedFacetFilters,
    updateSelectedFacetsFromUrl
} from "actions/FacetFilterActions";

// Components
import Layout from "components/Layout";
import NotFound from "components/routes/NotFound";
import Home from "components/routes/Home";
import OidcCallback from "components/routes/OidcCallback";
import OidcSignoutCallback from "components/routes/OidcSignoutCallback";
import MapContainer from "components/routes/MapContainer";
import Metadata from "components/routes/Metadata";

// Stylesheets
import "scss/styles.scss";

const initialState = {};
const storePromise = configureStore(initialState, userManagerPromise);
let store = null;
let userManager = null;

const App = () => {
    // State
    const [storeIsLoaded, setStoreIsLoaded] = useState(false);
    const [userManagerIsLoaded, setUserManagerIsLoaded] = useState(false);

    useEffect(() => {
        storePromise.then((storeConfig) => {
            store = storeConfig;
            setStoreIsLoaded(true);
        });
        userManagerPromise.then((userManagerConfig) => {
            userManager = userManagerConfig;
            setUserManagerIsLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (storeIsLoaded) {
            store.dispatch(fetchSelectedLanguage());
            store.dispatch(fetchResources());
            store.dispatch(fetchAvailableWFSServiceStatuses());
            store.dispatch(fetchAvailableWMSServiceStatuses());
            store.dispatch(getEnvironment());
        }
    }, [storeIsLoaded]);

    const getAvailableFacetsFromSearchResults = (searchResults) => {
        let availableFacets = {};
        if (searchResults?.metadata?.Facets?.length) {
            searchResults.metadata.Facets.forEach((facetFilterItem) => {
                availableFacets[facetFilterItem.FacetField] = facetFilterItem;
            });
        }
        return availableFacets;
    };

    const setExpandedFacetFilters = (selectedFacets) => {
        const state = store.getState();
        const expandedFacetFilters = state.expandedFacetFilters || {};
        Object.keys(selectedFacets).forEach((selectedFacetKey) => {
            expandedFacetFilters[selectedFacetKey] = true;
        });
        store.dispatch(updateExpandedFacetFilters(expandedFacetFilters));
    };

    const searchDataLoader = async ({ request, params }) => {
        const searchStringParam = new URL(request.url).searchParams.get("text") || "";
        const offsetParam = new URL(request.url).searchParams.get("offset");
        const appendParam = new URL(request.url).searchParams.get("append");
        const selectedResultsTypeParam = params.category || "metadata";

        const state = store.getState();
        const hasData =
            state?.searchResults &&
            Object.keys(state.searchResults)?.length &&
            state?.availableFacets &&
            Object.keys(state.availableFacets)?.length;

        let searchData = {
            results: {
                metadata: state?.searchResults?.metadata || [],
                articles: state?.searchResults?.articles || []
            },
            searchString: searchStringParam,
            offset: !!offsetParam && !isNaN(offsetParam) ? parseInt(offsetParam) : 0,
            selectedType: selectedResultsTypeParam,
            request
        };

        if (hasData && appendParam === "true") {
            searchData.selectedFacets = state?.selectedFacets;
            searchData.availableFacets = state?.availableFacets;
            return await Promise.all([
                store
                    .dispatch(
                        fetchMetadataSearchResults(
                            searchStringParam,
                            searchData.selectedFacets,
                            searchData.offset,
                            true
                        )
                    )
                    .then((metadata) => {
                        const oldMetadataSearchResults = searchData?.results?.metadata?.Results || [];
                        const newMetadataSearchResults = metadata?.payload?.Results || [];
                        searchData.results.metadata = {
                            ...metadata?.payload,
                            Results: oldMetadataSearchResults.concat(newMetadataSearchResults)
                        };
                        return metadata?.payload;
                    }),
                store
                    .dispatch(fetchArticleSearchResults(searchStringParam, searchData.offset, true))
                    .then((articles) => {
                        const oldArticlesSearchResults = searchData?.results?.articles?.Results || [];
                        const newArticlesSearchResults = articles?.payload?.Results || [];
                        searchData.results.articles = {
                            ...articles?.payload,
                            Results: oldArticlesSearchResults.concat(newArticlesSearchResults)
                        };
                        return articles?.payload;
                    })
            ]).then(() => {
                setExpandedFacetFilters(searchData.selectedFacets);
                return { params, searchData };
            });
        } else {
            store.dispatch(updateSelectedSearchResultsType(selectedResultsTypeParam));
            return await Promise.all([
                store.dispatch(fetchMetadataSearchResults(searchStringParam)).then((metadata) => {
                    searchData.results.metadata = metadata.payload;
                    return metadata?.payload;
                }),
                store.dispatch(fetchArticleSearchResults(searchStringParam)).then((articles) => {
                    searchData.results.articles = articles.payload;
                    return articles?.payload;
                })
            ]).then(() => {
                const availableFacets = getAvailableFacetsFromSearchResults(searchData.results);
                searchData.availableFacets = availableFacets;
                store.dispatch(updateAvailableFacets(availableFacets));
                const selectedFacets = store.dispatch(
                    updateSelectedFacetsFromUrl(availableFacets, decodeURIComponent(request.url))
                );
                searchData.selectedFacets = selectedFacets;
                if (!!selectedFacets && !!Object.keys(selectedFacets)?.length) {
                    return store
                        .dispatch(fetchMetadataSearchResults(searchStringParam, selectedFacets))
                        .then((metadata) => {
                            searchData.results.metadata = metadata.payload;
                            setExpandedFacetFilters(searchData.selectedFacets);
                            return { params, searchData };
                        });
                } else {
                    setExpandedFacetFilters(searchData.selectedFacets);
                    return { params, searchData };
                }
            });
        }
    };

    const router = createBrowserRouter([
        {
            element: <Layout userManager={userManager} />,
            path: "/",
            id: "root",
            loader: searchDataLoader,
            children: [
                {
                    element: <Home />,
                    index: true
                },
                {
                    element: <Home />,
                    path: ":category",
                    exact: true
                },
                {
                    element: <Metadata />,
                    path: "metadata/:uuid",
                    loader: async ({ params }) => {
                        return { testprop: "testvalue" };
                    }
                },
                {
                    element: <Metadata />,
                    path: "metadata/:title/:uuid",
                    loader: async ({ params }) => {
                        return { testprop: "testvalue" };
                    }
                },
                {
                    element: <Metadata />,
                    path: "metadata/:organizaton/:title/:uuid",
                    loader: async ({ params }) => {
                        return { testprop: "testvalue" };
                    }
                },
                {
                    //     element: <MapContainer />,
                    path: "kart"
                },
                {
                    element: <OidcCallback userManager={userManager} />,
                    path: "signin-oidc"
                },
                {
                    element: <OidcSignoutCallback userManager={userManager} />,
                    path: "signout-callback-oidc"
                }
            ]
        },
        {
            element: <NotFound />,
            path: "*"
        }
    ]);

    if (userManager && userManagerIsLoaded && storeIsLoaded) {
        return (
            <Provider store={store}>
                <OidcProvider userManager={userManager} store={store}>
                    <HelmetProvider>
                        <Helmet>
                            {process.env.REACT_APP_ENVIRONMENT && process.env.REACT_APP_ENVIRONMENT.length ? (
                                <meta name="robots" content="noindex" />
                            ) : null}
                        </Helmet>
                        <RouterProvider router={router} />
                    </HelmetProvider>
                </OidcProvider>
            </Provider>
        );
    } else return null;
};

export default App;
