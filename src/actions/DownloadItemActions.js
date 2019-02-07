import { FETCH_ITEMS_TO_DOWNLOAD } from './types';

export const fetchItemsToDownload = () => dispatch => {
	let itemsToDownload = localStorage.itemsToDownload && Array.isArray(JSON.parse(localStorage.itemsToDownload)) ? JSON.parse(localStorage.itemsToDownload) : [];
	dispatch({
		type: FETCH_ITEMS_TO_DOWNLOAD,
		payload: itemsToDownload
	})
}

export const removeItemSelectedForDownload = (itemToRemove) => dispatch => {
	let selectedItems = localStorage.itemsToDownload && Array.isArray(JSON.parse(localStorage.itemsToDownload)) ? JSON.parse(localStorage.itemsToDownload) : [];	
	localStorage.itemsToDownload = JSON.stringify(selectedItems.filter(itemToKeep => itemToKeep.Uuid !== itemToRemove.Uuid));
	
	dispatch(fetchItemsToDownload())
}

export const addItemSelectedForDownload = (itemToAdd) => dispatch => {
	let selectedItems = localStorage.itemsToDownload && Array.isArray(JSON.parse(localStorage.itemsToDownload)) ? JSON.parse(localStorage.itemsToDownload) : [];
    selectedItems.push(itemToAdd);
	localStorage.itemsToDownload = JSON.stringify(selectedItems);
	
	dispatch(fetchItemsToDownload())
}
