import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import searchResultReducer from './searchResultReducer';
import mapItemReducer from './mapItemReducer';
import SelectedFacetsReducer from './SelectedFacetsReducer';
import AvailableFacetsReducer from './AvailableFacetsReducer';

export default (history) => combineReducers({
	router: connectRouter(history),
	searchResults: searchResultReducer,
	mapItems: mapItemReducer,
	selectedFacets: SelectedFacetsReducer,
	availableFacets: AvailableFacetsReducer
});