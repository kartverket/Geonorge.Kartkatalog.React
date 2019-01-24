import { FETCH_MAPITEMS } from './types';

export const fetchMapItems = () => dispatch => {
	let mapItems = localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [];
	dispatch({
		type: FETCH_MAPITEMS,
		payload: mapItems
	})
}
