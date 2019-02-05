import { FETCH_MAPITEMS } from './types';

export const fetchMapItems = () => dispatch => {
	let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
	dispatch({
		type: FETCH_MAPITEMS,
		payload: mapItems
	})
}

export const removeMapItem = (mapItemToRemove) => dispatch => {
	let selectedMapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];	
	localStorage.mapItems = JSON.stringify(selectedMapItems.filter(mapItemToKeep => mapItemToKeep.Uuid !== mapItemToRemove.Uuid));
	
	dispatch(fetchMapItems())
	
}

export const addMapItem = (mapItemToAdd) => dispatch => {
	let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
    mapItems.push(mapItemToAdd);
	localStorage.mapItems = JSON.stringify(mapItems);
	
	dispatch(fetchMapItems())
	
}
