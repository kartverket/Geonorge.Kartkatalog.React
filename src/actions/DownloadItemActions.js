import { FETCH_ITEMS_TO_DOWNLOAD } from './types';
import { addToDataLayer, pushToDataLayer, getDataLayer } from '../reducers/TagManagerReducer';

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
	dispatch(pushToDataLayer({
		event: 'updateCart',
		category: 'download',
		activity: 'removeFromCart',
		metadata: itemToRemove
	}));

	dispatch(fetchItemsToDownload())
}



const addItemToLocalStorage = (itemToAdd => {
	let selectedItems = localStorage.orderItems && Array.isArray(JSON.parse(localStorage.orderItems)) ? JSON.parse(localStorage.orderItems) : [];
  selectedItems.push(itemToAdd.uuid);
	localStorage.orderItems = JSON.stringify(selectedItems);
	// TODO midlertidig løsning pga gammel handlekurv...
	localStorage.setItem(itemToAdd.uuid + ".metadata", JSON.stringify(itemToAdd))
})

export const addItemSelectedForDownload = (itemToAdd) => (dispatch, getState) => {
	if (itemToAdd.accessIsOpendata){
		addItemToLocalStorage(itemToAdd);
		dispatch(pushToDataLayer({
			event: 'updateCart',
			category: 'download',
			activity: 'addToCart',
			metadata: itemToAdd
		}));
		dispatch(fetchItemsToDownload())
	}else if (itemToAdd.accessIsRestricted){
		const baatInfo = getState() && getState().baatInfo ? getState().baatInfo : null;
		const capabilitiesUrl = itemToAdd.getCapabilitiesUrl + itemToAdd.uuid;
		if (baatInfo){
			fetch(capabilitiesUrl, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
			})
			.then((res) => res.json())
			.then((capabilities) => {
				const roles = baatInfo.baat_services ? baatInfo.baat_services : null;
				const constraintRequiredRole = capabilities.accessConstraintRequiredRole;
				let addDatasetIsAllowed = true;
				if(constraintRequiredRole === undefined) {
					addDatasetIsAllowed = true;
				}
				else
				{
					const requiredRoles = constraintRequiredRole.split(',').map(item => item.trim());

					for(let requiredRole of requiredRoles){
						addDatasetIsAllowed = requiredRole
						? roles && roles.length && roles.find(role => {return role === requiredRole}) !== undefined
						: true;
						if(!addDatasetIsAllowed)
							break;
					};

					let isAdmin = roles && roles.length && roles.find(role => {return role === "nd.metadata_admin"}) !== undefined;
					if(isAdmin)
					addDatasetIsAllowed = true;
				}
				if(addDatasetIsAllowed){
					addItemToLocalStorage(itemToAdd);
					console.log("adding restricted item");
					dispatch(fetchItemsToDownload())
				}else {
						alert('Du har ikke tilgang til å legge datasett i til nedlasting');
				}
			});
		}
	}
}

export const autoAddItemFromLocalStorage = () => (dispatch, getState) => {
	const hasItemToAdd = localStorage.autoAddDownloadItemOnLoad && localStorage.autoAddDownloadItemOnLoad.length && localStorage.autoAddDownloadItemOnLoad !== 'undefined' && localStorage.autoAddDownloadItemOnLoad !== 'null';
	const itemToAdd = hasItemToAdd ? JSON.parse(localStorage.autoAddDownloadItemOnLoad) : null;
	const isLoggedIn = getState().oidc && getState().oidc.user;
	const hasBaatInfo = getState().baatInfo && getState().baatInfo.user;
	if (itemToAdd && isLoggedIn && hasBaatInfo) {
		dispatch(addItemSelectedForDownload(itemToAdd));
		localStorage.removeItem('autoAddDownloadItemOnLoad');
	}
}
