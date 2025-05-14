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
import '@kartverket/geonorge-web-components/index.css';
import Cookies from 'js-cookie';

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

        var loggedInCookie = Cookies.get('_loggedInOtherApp');
        let autoRedirectPath = null;

        if(loggedInCookie === "true" && !isLoggedIn){
            sessionStorage.autoRedirectPath = window.location.pathname;
            console.log("redirecting to login");
            userManager.signinRedirect(); 
        }
        else if(sessionStorage?.autoRedirectPath){
                autoRedirectPath = sessionStorage.autoRedirectPath; 
        }

        if (isLoggedIn || hasBaatInfo) {
            dispatch(autoAddItemFromLocalStorage());
            dispatch(fetchItemsToDownload());
            dispatch(updateOidcCookie());
            dispatch(updateBaatInfo());
        }

        if(autoRedirectPath !== null){
            console.log("autoRedirectPath: " + autoRedirectPath);
            navigate(autoRedirectPath);
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
                if (isLocalhost) 
                    Cookies.set('_loggedIn', 'false');
                else
                    Cookies.set('_loggedIn', 'false', { domain: 'geonorge.no' });
                console.log("logging out");
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

    const userinfo = {
        name: oidc?.user?.profile?.name,
        email: oidc?.user?.profile?.email,
    };

    const orginfo = {
        organizationNumber: baatInfo?.organizationNumber,
        organizationName: baatInfo?.organizationName

    }

    const mainNavigationProps = {
        userinfo: JSON.stringify(userinfo),
        orginfo: JSON.stringify(orginfo),
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
