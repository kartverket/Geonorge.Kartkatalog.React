import { ADD_SELECTEDFACET, REMOVE_SELECTEDFACET } from '../actions/types';

export const addSelectedFacet = (facet, facetField) => dispatch => {
	dispatch({
		type: ADD_SELECTEDFACET,
		payload: facet,
		facetField: facetField
	})
}

export const removeSelectedFacet = (facet, facetField) => dispatch => {
	dispatch({
		type: REMOVE_SELECTEDFACET,
		payload: facet,
		facetField: facetField
	})
}
