import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import SearchResultReducer from './SearchResultReducer';
import MapItemReducer from './MapItemReducer';
import DownloadItemReducer from './DownloadItemReducer';
import SelectedFacetsReducer from './SelectedFacetsReducer';
import AvailableFacetsReducer from './AvailableFacetsReducer';
import SelectedSearchResultsTypeReducer from './SelectedSearchResultsTypeReducer';

export default (history) => combineReducers({
	router: connectRouter(history),
	searchResults: SearchResultReducer,
	selectedSearchResultsType: SelectedSearchResultsTypeReducer,
	mapItems: MapItemReducer,
	itemsToDownload: DownloadItemReducer,
	selectedFacets: SelectedFacetsReducer,
	availableFacets: AvailableFacetsReducer
});