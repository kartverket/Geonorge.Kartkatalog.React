import { ADD_SELECTEDFACET, REMOVE_SELECTEDFACET, UPDATE_SELECTEDFACETS } from '../actions/types';

const initialState = {
	type: [],
	theme: [],
	placegroups: [],
	nationalinitiative: [],
	organization: [],
	dataaccess: [],
	area: [],
	DistributionProtocols: [],
	license: []
}

export default function(state = initialState, action) {
	const selectedFacetsForFacetField = state[action.facetField] ? state[action.facetField] : [];

	switch(action.type) {
		case UPDATE_SELECTEDFACETS:
			return {
				...state,
					[action.facetField]: action.payload
				}
			
		case ADD_SELECTEDFACET:
			selectedFacetsForFacetField.push(action.payload);
			return {
				...state,
				[action.facetField]: selectedFacetsForFacetField
			};
		case REMOVE_SELECTEDFACET:
			for(var i=0; i < selectedFacetsForFacetField.length; i++) {
			   if(selectedFacetsForFacetField[i].Name === action.payload.Name)
			   {
			      selectedFacetsForFacetField.splice(i,1);
			   }
			}
			return {
				...state,
				[action.facetField]: selectedFacetsForFacetField
			};
		default:
			return state;
	}
}