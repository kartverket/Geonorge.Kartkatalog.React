// Dependencies
import React, { Fragment, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

// Actions
import { fetchMapItems } from 'actions/MapItemActions';
import { updateSelectedLanguage } from 'actions/SelectedLanguageActions';
import { fetchItemsToDownload, autoAddItemFromLocalStorage } from 'actions/DownloadItemActions';
import { updateOidcCookie, updateBaatInfo } from 'actions/AuthenticationActions';

// Components
import { MainNavigation } from '@kartverket/geonorge-web-components/MainNavigation';

const MainNavigationContainer = ({userManager}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux store
  const selectedSearchResultsType = useSelector(state => state.selectedSearchResultsType) || 'metadata';
  const searchResults = useSelector(state => state.searchResults);
  const searchString = useSelector(state => state.searchString);
  const selectedLanguage = useSelector(state => state.selectedLanguage);
  const oidc = useSelector(state => state.oidc);
  const baatInfo = useSelector(state => state.baatInfo);

  // Refs
  const userRef = useRef(null);

  const handleSubmitSearch = (searchString) => {
    searchString = searchString.toString();
    searchString = searchString.replace(/[^a-å0-9- ]+/ig, ""); // Removes unwanted characters
    searchString = searchString.replace(/\s\s+/g, ' '); // Remove redundant whitespace
    if (searchString.length > 1) {
      navigate(`/${selectedSearchResultsType}?text=${searchString}`)
    }
  }
  
  const handleChangeSearchResultsType = (searchResultsType) => {
    let searchString = searchString?.toString() || '';
    searchString = searchString.replace(/[^a-å0-9- ]+/ig, ""); // Removes unwanted characters
    searchString = searchString.replace(/\s\s+/g, ' '); // Remove redundant whitespace
    const searchStringParameter = searchString && searchString.length ? `?text=${searchString}` : '';
    navigate(`/${searchResultsType}${searchStringParameter}`);
  }


  useEffect(() => {
    dispatch(fetchMapItems());
    dispatch(fetchItemsToDownload());
    dispatch(updateOidcCookie());
    dispatch(updateBaatInfo());
    dispatch(autoAddItemFromLocalStorage());
  }, [])

  useEffect(() => {
    userRef.current = oidc?.user;
  },[oidc])

  useEffect(() => {
    const isLoggedIn = !!oidc?.user;
    const hasBaatInfo = !!baatInfo?.user;
    if (isLoggedIn || hasBaatInfo ) {
      dispatch(autoAddItemFromLocalStorage());
      dispatch(fetchItemsToDownload());
      dispatch(updateOidcCookie());
      dispatch(updateBaatInfo());
    }
    MainNavigation.setup('main-navigation', {
      onSearch: event => {
        const searchEvent = event.detail || null;
        if (searchEvent) {
          handleSubmitSearch(searchEvent.searchString)
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
        userManager.signoutRedirect({ 'id_token_hint': userRef?.current?.id_token });
        userManager.removeUser();
      },
      onNorwegianLanguageSelect: () => {
        dispatch(updateSelectedLanguage('no'));
      },
      onEnglishLanguageSelect: () => {
        dispatch(updateSelectedLanguage('en'));
      },
      onSearchTypeChange: event => {
        const searchType = event?.detail?.value || null;
        handleChangeSearchResultsType(searchType);
      },
      onMapItemsChange: event => {
        dispatch(fetchMapItems());
      },
      onDownloadItemsChange: event => {
        dispatch(fetchItemsToDownload());
      }
    })
  }, [oidc, baatInfo])


    const metadataResultsFound = searchResults?.metadata?.NumFound || 0;
    const articlesResultsFound = searchResults?.articles?.NumFound || 0;
    return searchResults ? (
      <Fragment>
        <Helmet htmlAttributes={{ lang : selectedLanguage }}/>
        <main-navigation
          isLoggedIn={!!oidc.user}
          language={selectedLanguage}
          environment={process.env.REACT_APP_ENVIRONMENT}
          searchString={searchString}
          searchType={selectedSearchResultsType}
          showsearchtypeselector
          metadataresultsfound={metadataResultsFound}
          articlesresultsfound={articlesResultsFound}
        >
        </main-navigation>
      </Fragment>
    ) : null;
}


export default MainNavigationContainer;
