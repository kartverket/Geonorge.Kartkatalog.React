import { FETCH_ITEMS_TO_DOWNLOAD } from './types';

export const fetchItemsToDownload = () => dispatch => {
	let itemsToDownload = localStorage.orderItems && Array.isArray(JSON.parse(localStorage.orderItems)) ? JSON.parse(localStorage.orderItems) : [];
	dispatch({
		type: FETCH_ITEMS_TO_DOWNLOAD,
		payload: itemsToDownload
	})
}

export const getDownloadItemMetadata = (itemUuid) => dispatch => {
	return localStorage[itemUuid + '.metadata'] ? JSON.parse(localStorage[itemUuid + '.metadata']) : null;
}

export const removeItemSelectedForDownload = (itemToRemove) => dispatch => {
	let selectedItems = localStorage.orderItems && Array.isArray(JSON.parse(localStorage.orderItems)) ? JSON.parse(localStorage.orderItems) : [];	
	localStorage.orderItems = JSON.stringify(selectedItems.filter(itemToKeep => itemToKeep !== itemToRemove.uuid));

	// TODO midlertidig løsning pga gammel handlekurv...
	localStorage.removeItem(itemToRemove.uuid + ".metadata")

	dispatch(fetchItemsToDownload())
}

export const addItemSelectedForDownload = (itemToAdd) => dispatch => {
	let selectedItems = localStorage.orderItems && Array.isArray(JSON.parse(localStorage.orderItems)) ? JSON.parse(localStorage.orderItems) : [];
    selectedItems.push(itemToAdd.uuid);
	localStorage.orderItems = JSON.stringify(selectedItems);

	// TODO midlertidig løsning pga gammel handlekurv...
	localStorage.setItem(itemToAdd.uuid + ".metadata", JSON.stringify(itemToAdd))


	
	dispatch(fetchItemsToDownload())
}
