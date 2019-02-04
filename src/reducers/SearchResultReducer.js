import * as Cookies from 'js-cookie';
import { FETCH_METADATASEARCHRESULTS, FETCH_ARTICLESEARCHRESULTS, FETCH_DROPDOWNSEARCHRESULTS, APPEND_TO_METADATASEARCHRESULTS } from '../actions/types';

const initialState = {}

export default function (state = initialState, action) {
	switch (action.type) {
		case APPEND_TO_METADATASEARCHRESULTS:
		console.log('9')
			const appendedSearchResult = state.metadata.Results.concat(action.payload.Results)
			return {
				...state,
				metadata: {
					...state.metadata,
					Results: appendedSearchResult
				}
			}
		case FETCH_METADATASEARCHRESULTS:
			return {
				...state,
				metadata: action.payload
			}
		case FETCH_ARTICLESEARCHRESULTS:
			return {
				...state,
				articles: action.payload
			};
		case FETCH_DROPDOWNSEARCHRESULTS:
			const getTypeTranslated = () => {
				if (action.payload.Results && action.payload.Results.length && action.payload.Results[0].TypeTranslated) {
					return action.payload.Results[0].TypeTranslated;
				} else if (action.searchResultsType === 'articles') {
					const selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
					return selectedLanguage === 'en' ? 'Articles' : 'Artikler';
				} else {
					return action.searchResultsType
				}
			};
			return {
				...state,
				dropdownResults: {
					...state.dropdownResults,
					[action.searchResultsType]: {
						...action.payload,
						TypeTranslated: getTypeTranslated()
					}
				}
			}
		default:
			return state;
	}
}