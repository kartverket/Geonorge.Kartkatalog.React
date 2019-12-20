import { FETCH_MAPITEMS } from './types';
import { pushToDataLayer } from '../reducers/TagManagerReducer';

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
		if (mapItemToRemove && mapItemToRemove.Uuid) {
			const tagData = {
        name: mapItemToRemove.Title,
        uuid: mapItemToRemove.Uuid
      }
			dispatch(pushToDataLayer({
				event: 'updateMap',
				category: 'map',
				activity: 'removeFromMap',
				metadata: tagData
			}));
			localStorage.mapItems = JSON.stringify(selectedMapItems.filter(mapItemToKeep => {
				return mapItemToKeep && mapItemToKeep.Uuid && mapItemToKeep.Uuid !== mapItemToRemove.Uuid
			}));
			selectedMapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
		}
	});


	dispatch(fetchMapItems())
}

export const addMapItem = (mapItemsToAdd) => dispatch => {
	let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
	mapItemsToAdd.forEach(mapItemToAdd => {
		if (mapItemToAdd && mapItemToAdd.Uuid) {
			mapItems.push(mapItemToAdd);
			const tagData = {
        name: mapItemToAdd.Title,
        uuid: mapItemToAdd.Uuid
      }
			dispatch(pushToDataLayer({
				event: 'updateMap',
				category: 'map',
				activity: 'addToMap',
				metadata: tagData
			}));
		}
	});

	// mapItems.push(mapItemToAdd);
	localStorage.mapItems = JSON.stringify(mapItems);

	dispatch(fetchMapItems())
}
