import { ADD_SELECTEDFACET, REMOVE_SELECTEDFACET, UPDATE_SELECTEDFACETS, UPDATE_SELECTED_FACETS_FOR_FACET_FIELD } from '../actions/types';

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

function clearState(state) {
	Object.keys(state).forEach(facetField => {
		state[facetField] = [];
	});
	return state;
}

export default function (state = initialState, action) {
	const selectedFacetsForFacetField = state[action.facetField] ? state[action.facetField] : [];

	switch (action.type) {
		case UPDATE_SELECTEDFACETS:
			state = clearState(state);
			action.payload.forEach(facet => {
				state[facet.facetField] = facet.facets
			})
			return state

		case UPDATE_SELECTED_FACETS_FOR_FACET_FIELD:
			return {
				...state,
				[action.facetField]: action.payload,
			}
		case ADD_SELECTEDFACET:
			selectedFacetsForFacetField.push(action.payload);
			return {
				...state,
				[action.facetField]: selectedFacetsForFacetField
			};
		case REMOVE_SELECTEDFACET:
			const removeFacet = (facet) => {
				for (var facetIndex = 0; facetIndex < selectedFacetsForFacetField.length; facetIndex++) {
					if (selectedFacetsForFacetField[facetIndex].Name === facet.Name) {
						if (selectedFacetsForFacetField[facetIndex].FacetResults) {
							removeFacets(selectedFacetsForFacetField[facetIndex].FacetResults);
						}
						selectedFacetsForFacetField.splice(facetIndex, 1);
					}
				}
			}
			const removeFacets = (facets) => {
				for (var facetIndex = 0; facetIndex < facets.length; facetIndex++) {
					removeFacet(facets[facetIndex]);
				}
			}

			removeFacet(action.payload);

			return {
				...state,
				[action.facetField]: selectedFacetsForFacetField
			};
		default:
			return state;
	}
}