import { FETCH_METADATASEARCHRESULTS, FETCH_ARTICLESEARCHRESULTS, FETCH_DROPDOWNSEARCHRESULTS } from '../actions/types';

const initialState = {}

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_METADATASEARCHRESULTS:
			return {
				...state,
				metadata: action.payload
			};
		case FETCH_ARTICLESEARCHRESULTS:
			return {
				...state,
				articles: action.payload
			};
		case FETCH_DROPDOWNSEARCHRESULTS:
		return {
			...state,
			dropdownResults:{ 
				...state.dropdownResults,
				[action.searchResultsType]: action.payload 
			}
		}
		default:
			return state;
	}
}