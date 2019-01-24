import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import SearchResultReducer from './SearchResultReducer';
import MapItemReducer from './MapItemReducer';
import SelectedFacetsReducer from './SelectedFacetsReducer';
import AvailableFacetsReducer from './AvailableFacetsReducer';

export default (history) => combineReducers({
	router: connectRouter(history),
	searchResults: SearchResultReducer,
	mapItems: MapItemReducer,
	selectedFacets: SelectedFacetsReducer,
	availableFacets: AvailableFacetsReducer
});