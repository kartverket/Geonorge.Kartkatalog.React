import { FETCH_AVAILABLEFACETS } from '../actions/types';

const initialState = {
	
}

export default function(state = initialState, action) {
	const selectedFacetsForFacetField = state[action.facetField] ? state[action.facetField] : [];

	switch(action.type) {
		case FETCH_AVAILABLEFACETS:
			return action.payload;
		default:
			return state;
	}
}