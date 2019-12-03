import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router'
import { reducer as oidcReducer } from 'redux-oidc';
import SearchResultReducer from './SearchResultReducer';
import MapItemReducer from './MapItemReducer';
import DownloadItemReducer from './DownloadItemReducer';
import SelectedFacetsReducer from './SelectedFacetsReducer';
import AvailableFacetsReducer from './AvailableFacetsReducer';
import SelectedSearchResultsTypeReducer from './SelectedSearchResultsTypeReducer';
import SearchStringReducer from './SearchStringReducer';
import MetadataReducer from "./MetadataReducer";
import MetadataDistributionReducer from "./MetadataDistributionReducer";
import GeonorgeMenuReducer from "./GeonorgeMenuReducer";
import SelectedLanguageReducer from "./SelectedLanguageReducer";
import ResourceReducer from "./ResourceReducer";
import EnvironmentReducer from './EnvironmentReducer';
import BaatInfoReducer from './BaatInfoReducer';
import TagManagerReducer from './TagManagerReducer';

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
