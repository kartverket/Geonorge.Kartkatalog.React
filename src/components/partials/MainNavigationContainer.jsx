// Dependencies
import React, { Fragment, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

// Actions
import { fetchMapItems } from "@/actions/MapItemActions";
import { updateSelectedLanguage } from "@/actions/SelectedLanguageActions";
import { fetchItemsToDownload, autoAddItemFromLocalStorage } from "@/actions/DownloadItemActions";

// Components
import { MainNavigation } from "@kartverket/geonorge-web-components/MainNavigation";
import '@kartverket/geonorge-web-components/index.css';
import { getEnvironment } from "@/utils/runtimeConfig";

const MainNavigationContainer = ({ layoutLoaderData }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { searchData, params } = layoutLoaderData;

    // Redux store
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    // Refs
    const lastSearchStringRef = useRef(searchData?.searchString || "");

    // Keep the last non-empty search string so navigating away and back
    // doesn't reopen the autocomplete popup.
    if (searchData?.searchString) {
        lastSearchStringRef.current = searchData.searchString;
    }

    const handleSubmitSearch = (searchString, selectedType) => {
        searchString = searchString.toString();
        searchString = searchString.replace(/[^a-å0-9- ]+/gi, ""); // Removes unwanted characters
        searchString = searchString.replace(/\s\s+/g, " "); // Remove redundant whitespace
        if (searchString.length > 1) {
            const isLoggedIn = false; //TODO
            const view = new URLSearchParams(window.location.search).get("view");
            const viewParam = view ? `&view=${view}` : "";
            if (isLoggedIn) {
                location.href = `/${selectedType}?text=${searchString}${viewParam}`;
            }
            else{
                navigate(`/${selectedType}?text=${searchString}${viewParam}`);
            }
        }
    };

    const handleChangeSearchResultsType = (searchResultsType, searchString) => {
        searchString = searchString.replace(/[^a-å0-9- ]+/gi, ""); // Removes unwanted characters
        searchString = searchString.replace(/\s\s+/g, " "); // Remove redundant whitespace
        const view = new URLSearchParams(window.location.search).get("view");
        const viewParam = view ? `${searchString && searchString.length ? "&" : "?"}view=${view}` : "";
        const searchStringParameter = searchString && searchString.length ? `?text=${searchString}` : "";
        navigate(`/${searchResultsType}${searchStringParameter}${viewParam}`);
    };

    useEffect(() => {
        dispatch(fetchMapItems());
        dispatch(fetchItemsToDownload());
        dispatch(autoAddItemFromLocalStorage());
    }, []);

    useEffect(() => {
        MainNavigation.setup("main-navigation", {
            onSearch: (event) => {
                const searchEvent = event.detail || null;
                if (searchEvent) {
                    handleSubmitSearch(searchEvent.searchString, params.searchResultsType);
                }
            },
            onSignInClick: (event) => {
                event.preventDefault();
                console.log("LOGIN") //TODO
            },
            onSignOutClick: (event) => {
                event.preventDefault();
                console.log("LOGUT") //TODO
            },
            onNorwegianLanguageSelect: async () => {
                await dispatch(updateSelectedLanguage("no"));
                window.location.reload();
            },
            onEnglishLanguageSelect: async () => {
                await dispatch(updateSelectedLanguage("en"));
                window.location.reload();
            },
            onSearchTypeChange: (event) => {
                const searchType = event?.detail?.value || null;
                handleChangeSearchResultsType(searchType, lastSearchStringRef.current);
            },
            onMapItemsChange: (event) => {
                dispatch(fetchMapItems());
            },
            onDownloadItemsChange: (event) => {
                dispatch(fetchItemsToDownload());
            }
        });
    }, [searchData?.searchString]);

    const metadataResultsFound = searchData?.results?.metadata?.NumFound || 0;
    const articlesResultsFound = searchData?.results?.articles?.NumFound || 0;

    const userinfo = {
        name: "Navn Navnesen", //TODO
        email: "navn.navnesen@eksempel.no",
    };

    const orginfo = {
        organizationNumber: 915000000, //TODO
        organizationName: "Orgnavn"

    }

    const mainNavigationProps = {
        userinfo: JSON.stringify(userinfo),
        orginfo: JSON.stringify(orginfo),
        isLoggedIn: false, //TODO
        language: selectedLanguage,
        environment: getEnvironment(),
        searchString: lastSearchStringRef.current,
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

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );

export default MainNavigationContainer;
