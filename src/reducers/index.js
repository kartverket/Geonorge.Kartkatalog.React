import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router'
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

export default (history) => combineReducers({
    router: connectRouter(history),
    searchResults: SearchResultReducer,
    selectedSearchResultsType: SelectedSearchResultsTypeReducer,
    metadata: MetadataReducer,
    metadataDistributions: MetadataDistributionReducer,
    mapItems: MapItemReducer,
    itemsToDownload: DownloadItemReducer,
    selectedFacets: SelectedFacetsReducer,
    availableFacets: AvailableFacetsReducer,
    searchString: SearchStringReducer,
    geonorgeMenu: GeonorgeMenuReducer
});
