// Dependencies
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router'

// Reducers
import authReducer from 'reducers/authReducer';
import SearchResultReducer from 'reducers/SearchResultReducer';
import MapItemReducer from 'reducers/MapItemReducer';
import DownloadItemReducer from 'reducers/DownloadItemReducer';
import SelectedFacetsReducer from 'reducers/SelectedFacetsReducer';
import AvailableFacetsReducer from 'reducers/AvailableFacetsReducer';
import ExpandedFacetFiltersReducer from 'reducers/ExpandedFacetFiltersReducer';
import SelectedSearchResultsTypeReducer from 'reducers/SelectedSearchResultsTypeReducer';
import SearchStringReducer from 'reducers/SearchStringReducer';
import GeonorgeMenuReducer from "reducers/GeonorgeMenuReducer";
import SelectedLanguageReducer from "reducers/SelectedLanguageReducer";
import ResourceReducer from "reducers/ResourceReducer";
import EnvironmentReducer from 'reducers/EnvironmentReducer';
import BaatInfoReducer from 'reducers/BaatInfoReducer';
import TagManagerReducer from 'reducers/TagManagerReducer';
import AvailableWFSServiceStatusesForReducer from 'reducers/AvailableWFSServiceStatusesReducer';
import AvailableWMSServiceStatusesForReducer from 'reducers/AvailableWMSServiceStatusesReducer';

export default (history) => combineReducers({
    dataLayer: TagManagerReducer,
    router: connectRouter(history),
    auth: authReducer,
    baatInfo: BaatInfoReducer,
    searchResults: SearchResultReducer,
    selectedSearchResultsType: SelectedSearchResultsTypeReducer,
    mapItems: MapItemReducer,
    itemsToDownload: DownloadItemReducer,
    selectedFacets: SelectedFacetsReducer,
    availableFacets: AvailableFacetsReducer,
    expandedFacetFilters: ExpandedFacetFiltersReducer,
    searchString: SearchStringReducer,
    geonorgeMenu: GeonorgeMenuReducer,
    selectedLanguage: SelectedLanguageReducer,
    resources: ResourceReducer,
    environment: EnvironmentReducer,
    availableWFSServiceStatuses: AvailableWFSServiceStatusesForReducer,
    availableWMSServiceStatuses: AvailableWMSServiceStatusesForReducer
});
