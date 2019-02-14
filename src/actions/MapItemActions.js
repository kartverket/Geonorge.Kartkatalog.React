import { FETCH_MAPITEMS } from './types';

export const fetchMapItems = () => dispatch => {
	let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
	dispatch({
		type: FETCH_MAPITEMS,
		payload: mapItems
	})
}

export const removeMapItem = (mapItemsToRemove) => dispatch => {
	let selectedMapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
	mapItemsToRemove.forEach(mapItemToRemove => {
		localStorage.mapItems = JSON.stringify(selectedMapItems.filter(mapItemToKeep => mapItemToKeep.Uuid !== mapItemToRemove.Uuid));
		selectedMapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
	});

	dispatch(fetchMapItems())
}

export const addMapItem = (mapItemsToAdd) => dispatch => {
	let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
	mapItemsToAdd.forEach(mapItemToAdd => {
		mapItems.push(mapItemToAdd);
	});
	
	// mapItems.push(mapItemToAdd);
	localStorage.mapItems = JSON.stringify(mapItems);
	
	dispatch(fetchMapItems())
}
