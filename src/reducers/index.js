// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router'
import { reducer as oidcReducer } from 'redux-oidc';

// Reducers
import SearchResultReducer from 'reducers/SearchResultReducer';
import MapItemReducer from 'reducers/MapItemReducer';
import DownloadItemReducer from 'reducers/DownloadItemReducer';
import SelectedFacetsReducer from 'reducers/SelectedFacetsReducer';
import AvailableFacetsReducer from 'reducers/AvailableFacetsReducer';
import SelectedSearchResultsTypeReducer from 'reducers/SelectedSearchResultsTypeReducer';
import SearchStringReducer from 'reducers/SearchStringReducer';
import MetadataReducer from "reducers/MetadataReducer";
import MetadataDistributionReducer from "reducers/MetadataDistributionReducer";
import GeonorgeMenuReducer from "reducers/GeonorgeMenuReducer";
import SelectedLanguageReducer from "reducers/SelectedLanguageReducer";
import ResourceReducer from "reducers/ResourceReducer";
import EnvironmentReducer from 'reducers/EnvironmentReducer';
import BaatInfoReducer from 'reducers/BaatInfoReducer';
import TagManagerReducer from 'reducers/TagManagerReducer';

export default (history) => combineReducers({
    dataLayer: TagManagerReducer,
    router: connectRouter(history),
    oidc: oidcReducer,
    baatInfo: BaatInfoReducer,
    searchResults: SearchResultReducer,
    selectedSearchResultsType: SelectedSearchResultsTypeReducer,
    metadata: MetadataReducer,
    metadataDistributions: MetadataDistributionReducer,
    mapItems: MapItemReducer,
    itemsToDownload: DownloadItemReducer,
    selectedFacets: SelectedFacetsReducer,
    availableFacets: AvailableFacetsReducer,
    searchString: SearchStringReducer,
    geonorgeMenu: GeonorgeMenuReducer,
    selectedLanguage: SelectedLanguageReducer,
    resources: ResourceReducer,
    environment: EnvironmentReducer
});
