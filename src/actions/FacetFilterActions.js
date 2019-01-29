import { ADD_SELECTEDFACET, REMOVE_SELECTEDFACET, UPDATE_SELECTEDFACETS, UPDATE_SELECTED_FACETS_FOR_FACET_FIELD } from '../actions/types';

export const addSelectedFacet = (facet, facetField) => dispatch => {
	dispatch({
		type: ADD_SELECTEDFACET,
		payload: facet, // Fasett - eks: Datasett
		facetField: facetField // kategori - eks: Område
	})
}

export const removeSelectedFacet = (facet, facetField) => dispatch => {
	dispatch({
		type: REMOVE_SELECTEDFACET,
		payload: facet,
		facetField: facetField
	})
}

export const updateSelectedFacets = (facets) => dispatch => {
		dispatch({
			type: UPDATE_SELECTEDFACETS,
			payload: facets,
		})
}

export const updateSelectedFacetsForFacetField = (facets, facetField) => dispatch => {
	dispatch({
		type: UPDATE_SELECTED_FACETS_FOR_FACET_FIELD,
		payload: facets,
		facetField: facetField
	})
}

