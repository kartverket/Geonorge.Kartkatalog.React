// Dependencies
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import { fetchMapItems, removeMapItem } from 'actions/MapItemActions';
import { updateSelectedLanguage } from 'actions/SelectedLanguageActions';
import { fetchItemsToDownload, removeItemSelectedForDownload, getDownloadItemMetadata, autoAddItemFromLocalStorage } from 'actions/DownloadItemActions';
import { updateSelectedSearchResultsType } from 'actions/SelectedSearchResultsTypeActions';
import { updateOidcCookie, updateBaatInfo } from 'actions/AuthenticationActions';
import { getResource } from 'actions/ResourceActions'

// Components
import { MainNavigation } from '@kartverket/geonorge-web-components/MainNavigation';


// Utils
import userManager from 'utils/userManager';

export class MainNavigationContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      tabs: [
        {
          id: 'metadata',
          nameResourceKey: 'MapCatalog',
          nameResourceFallback: 'Kartkatalogen',
          counterProperty: 'NumFound'
        },
        {
          id: 'articles',
          nameResourceKey: 'Articles',
          nameResourceFallback: 'Artikler',
          counterProperty: 'NumFound'
        }
      ]
    };
  }

  componentDidMount() {
    this.props.fetchMapItems();
    this.props.fetchItemsToDownload();
    this.props.updateOidcCookie();
    this.props.updateBaatInfo();
    this.props.autoAddItemFromLocalStorage();

    MainNavigation.setup('main-navigation', {
      onSearch: event => {
        const searchEvent = event.detail || null;
        if (searchEvent) {
          this.handleSubmitSearch(searchEvent.searchString)
        }
      },
      onSignInClick: (event) => {
        event.preventDefault();
        userManager.signinRedirect();
      },
      onSignOutClick: (event) => {
        event.preventDefault();
        userManager.signoutRedirect({ 'id_token_hint': this.props.oidc.user.id_token });
        userManager.removeUser();
      },
      onNorwegianLanguageSelect: () => {
        this.props.updateSelectedLanguage('no');
      },
      onEnglishLanguageSelect: () => {
        this.props.updateSelectedLanguage('en');
      },
      onSearchTypeChange: event => {
        const searchType = event && event.detail && event.detail.value ? event.detail.value : null;
        this.handleChangeSearchResultsType(searchType);
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const wasLoggedIn = prevProps.oidc && prevProps.oidc.user;
    const isLoggedIn = this.props.oidc && this.props.oidc.user;
    const hadBaatInfo = prevProps.baatInfo && prevProps.baatInfo.user;
    const hasBaatInfo = this.props.baatInfo && this.props.baatInfo.user;
    if ((isLoggedIn !== wasLoggedIn) || (hasBaatInfo !== hadBaatInfo)) {
      this.props.autoAddItemFromLocalStorage();
      this.props.fetchItemsToDownload();
      this.props.updateOidcCookie();
      this.props.updateBaatInfo();
    }
    if (this.state.redirect) {
      this.setState({ redirect: null });
    }
  }

  handleSubmitSearch(searchString) {
    searchString = searchString.replace(/[^a-å0-9- ]+/ig, ""); // Removes unwanted characters
    searchString = searchString.replace(/\s\s+/g, ' '); // Remove redundant whitespace
    if (searchString.length > 1) {
      this.setState({
        redirect: `/${this.props.selectedSearchResultsType}?text=${searchString}`
      });
    }
  }

  handleChangeSearchResultsType(searchResultsType) {
    let searchString = this.props.searchString;
    searchString = searchString.replace(/[^a-å0-9- ]+/ig, ""); // Removes unwanted characters
    searchString = searchString.replace(/\s\s+/g, ' '); // Remove redundant whitespace
    const searchStringParameter = searchString && searchString.length ? `?text=${searchString}` : '';
    this.setState({
      redirect: `/${searchResultsType}${searchStringParameter}`
    });

  }

  render() {
    const selectedSearchResultsType = this.props.selectedSearchResultsType ? this.props.selectedSearchResultsType : 'metadata';
    const metadataResultsFound = this.props.searchResults && this.props.searchResults.metadata && this.props.searchResults.metadata.NumFound ? this.props.searchResults.metadata.NumFound : 0;
    const articlesResultsFound = this.props.searchResults && this.props.searchResults.articles && this.props.searchResults.articles.NumFound ? this.props.searchResults.articles.NumFound : 0;
    return this.props.searchResults ? (
      <React.Fragment>
        <main-navigation
          isLoggedIn={this.props.oidc.user ? true : false}
          language={this.props.selectedLanguage}
          environment={process.env.REACT_APP_ENVIRONMENT}
          searchString={this.props.searchString}
          searchType={selectedSearchResultsType}
          showsearchtypeselector
          metadataresultsfound={metadataResultsFound}
          articlesresultsfound={articlesResultsFound}
        >
        </main-navigation>
        { this.state.redirect ? <Redirect to={this.state.redirect} /> : ''}
      </React.Fragment>
    ) : '';
  }
}


MainNavigationContainer.propTypes = {
  fetchMapItems: PropTypes.func.isRequired,
  removeMapItem: PropTypes.func.isRequired,
  fetchItemsToDownload: PropTypes.func.isRequired,
  removeItemSelectedForDownload: PropTypes.func.isRequired,
  getDownloadItemMetadata: PropTypes.func.isRequired,
  mapItems: PropTypes.array.isRequired,
  itemsToDownload: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  mapItems: state.mapItems,
  itemsToDownload: state.itemsToDownload,
  selectedSearchResultsType: state.selectedSearchResultsType,
  selectedFacets: state.selectedFacets,
  searchResults: state.searchResults,
  searchString: state.searchString,
  router: state.router,
  selectedLanguage: state.selectedLanguage,
  resources: state.resources,
  oidc: state.oidc,
  baatInfo: state.baatInfo
});


const mapDispatchToProps = {
  fetchMapItems,
  removeMapItem,
  fetchItemsToDownload,
  removeItemSelectedForDownload,
  getDownloadItemMetadata,
  autoAddItemFromLocalStorage,
  updateSelectedSearchResultsType,
  updateOidcCookie,
  updateBaatInfo,
  getResource,
  updateSelectedLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigationContainer);
