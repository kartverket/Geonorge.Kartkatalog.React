// Dependencies
import React, { Fragment, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

// Actions
import { fetchMapItems } from "actions/MapItemActions";
import { updateSelectedLanguage } from "actions/SelectedLanguageActions";
import { fetchItemsToDownload, autoAddItemFromLocalStorage } from "actions/DownloadItemActions";
import { updateOidcCookie, updateBaatInfo } from "actions/AuthenticationActions";

// Components
import { MainNavigation } from "@kartverket/geonorge-web-components/MainNavigation";

const MainNavigationContainer = ({ userManager, layoutLoaderData }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { searchData, params } = layoutLoaderData;

    // Redux store
    const selectedLanguage = useSelector((state) => state.selectedLanguage);
    const oidc = useSelector((state) => state.oidc);
    const baatInfo = useSelector((state) => state.baatInfo);

    // Refs
    const userRef = useRef(null);

    const handleSubmitSearch = (searchString, selectedType) => {
        searchString = searchString.toString();
        searchString = searchString.replace(/[^a-å0-9- ]+/gi, ""); // Removes unwanted characters
        searchString = searchString.replace(/\s\s+/g, " "); // Remove redundant whitespace
        if (searchString.length > 1) {
            navigate(`/${selectedType}?text=${searchString}`);
        }
    };

    const handleChangeSearchResultsType = (searchResultsType, searchString) => {
        searchString = searchString.replace(/[^a-å0-9- ]+/gi, ""); // Removes unwanted characters
        searchString = searchString.replace(/\s\s+/g, " "); // Remove redundant whitespace
        const searchStringParameter = searchString && searchString.length ? `?text=${searchString}` : "";
        navigate(`/${searchResultsType}${searchStringParameter}`);
    };

    useEffect(() => {
        dispatch(fetchMapItems());
        dispatch(fetchItemsToDownload());
        dispatch(updateOidcCookie());
        dispatch(updateBaatInfo());
        dispatch(autoAddItemFromLocalStorage());
    }, []);

    useEffect(() => {
        userRef.current = oidc?.user;
    }, [oidc]);

    useEffect(() => {
        const isLoggedIn = !!oidc?.user;
        const hasBaatInfo = !!baatInfo?.user;
        if (isLoggedIn || hasBaatInfo) {
            dispatch(autoAddItemFromLocalStorage());
            dispatch(fetchItemsToDownload());
            dispatch(updateOidcCookie());
            dispatch(updateBaatInfo());
        }
        MainNavigation.setup("main-navigation", {
            onSearch: (event) => {
                const searchEvent = event.detail || null;
                if (searchEvent) {
                    handleSubmitSearch(searchEvent.searchString, params.searchResultsType);
                }
            },
            onSignInClick: (event) => {
                event.preventDefault();
                sessionStorage.autoRedirectPath = window.location.pathname;
                userManager.signinRedirect();
            },
            onSignOutClick: (event) => {
                event.preventDefault();
                sessionStorage.autoRedirectPath = window.location.pathname;
                userManager.signoutRedirect({ id_token_hint: userRef?.current?.id_token });
                userManager.removeUser();
            },
            onNorwegianLanguageSelect: () => {
                dispatch(updateSelectedLanguage("no"));
            },
            onEnglishLanguageSelect: () => {
                dispatch(updateSelectedLanguage("en"));
            },
            onSearchTypeChange: (event) => {
                const searchType = event?.detail?.value || null;
                handleChangeSearchResultsType(searchType, searchData?.searchString);
            },
            onMapItemsChange: (event) => {
                dispatch(fetchMapItems());
            },
            onDownloadItemsChange: (event) => {
                dispatch(fetchItemsToDownload());
            }
        });
    }, [oidc, baatInfo]);

    const metadataResultsFound = searchData?.results?.metadata?.NumFound || 0;
    const articlesResultsFound = searchData?.results?.articles?.NumFound || 0;

    const mainNavigationProps = {
        isLoggedIn: !!oidc.user,
        language: selectedLanguage,
        environment: process.env.REACT_APP_ENVIRONMENT,
        searchString: searchData?.searchString || "",
        searchType: params.searchResultsType,
        showsearchtypeselector: true,//showSearchTypeSelector,
        metadataresultsfound: metadataResultsFound,
        articlesresultsfound: articlesResultsFound,
        maincontentid: "main-content"
    };
    return (
        <Fragment>
            <Helmet htmlAttributes={{ lang: selectedLanguage }} />
            <main-navigation {...mainNavigationProps}></main-navigation>
        </Fragment>
    );
};

export default MainNavigationContainer;
