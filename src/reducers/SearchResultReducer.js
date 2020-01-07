import * as Cookies from 'js-cookie';
import { FETCH_METADATASEARCHRESULTS, FETCH_ARTICLESEARCHRESULTS, FETCH_DROPDOWNSEARCHRESULTS, APPEND_TO_METADATASEARCHRESULTS, APPEND_TO_ARTICLESEARCHRESULTS } from 'actions/types';

const initialState = {}

export default function (state = initialState, action) {
	switch (action.type) {
		case APPEND_TO_METADATASEARCHRESULTS:
			const appendedSearchResult = state.metadata.Results.concat(action.payload.Results)
			return {
				...state,
				metadata: {
					...state.metadata,
					Offset: state.metadata.Offset + 25,
					Results: appendedSearchResult
				}
			}
		case FETCH_METADATASEARCHRESULTS:
			return {
				...state,
				metadata: action.payload
			}
		case APPEND_TO_ARTICLESEARCHRESULTS:
			const appendedArticles = state.articles.Results.concat(action.payload.Results)
			return {
				...state,
				articles: {
					...state.articles,
					Offset: state.articles.Offset + 25,
					Results: appendedArticles
				}
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
