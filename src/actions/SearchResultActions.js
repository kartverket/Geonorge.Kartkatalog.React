import * as Cookies from 'js-cookie';
import { FETCH_METADATASEARCHRESULTS, FETCH_ARTICLESEARCHRESULTS, FETCH_DROPDOWNSEARCHRESULTS, FETCH_AVAILABLEFACETS } from './types';

export const fetchMetadataSearchResults = (searchString = "", facets = null) => dispatch => {
	let facetsParameter = [];
	if (facets) {
		let facetIndex = -1;
		Object.keys(facets).filter((facetField) => {
			return facets[facetField].length;
		}).forEach((facetField) => {
			facets[facetField].forEach((facet) => {
				facetIndex++;
				facetsParameter.push(`facets[${facetIndex}]name=${facetField}&facets[${facetIndex}]value=${facet.Name}`);
			})
		})
	}
	let facetsParameterString = facetsParameter.join('&');
	facetsParameterString = facetsParameterString ? "&" + facetsParameterString : "";

	const selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
	const fetchOptions = {
		headers: new Headers({
			'Accept-Language': selectedLanguage
		})
	};

	fetch(`https://kartkatalog.dev.geonorge.no/api/search?text=${searchString}${facetsParameterString}`, fetchOptions)
		.then(res => res.json())
		.then(searchResults => {
			dispatch({
				type: FETCH_METADATASEARCHRESULTS,
				payload: searchResults,
				searchString: searchString
			})
			let availableFacets = {};
			searchResults.Facets.forEach((facetFilterItem) => {
				availableFacets[facetFilterItem.FacetField] = facetFilterItem;
			})
			dispatch({
				type: FETCH_AVAILABLEFACETS,
				payload: availableFacets
			})
		})
}

export const fetchArticleSearchResults = (searchString = "") => dispatch => {
	let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
	const fetchOptions = {
		headers: new Headers({
			'Accept-Language': selectedLanguage
		})
	};

	fetch(`https://kartkatalog.dev.geonorge.no/api/articles?text=${searchString}`, fetchOptions)
		.then(res => res.json())
		.then(searchResults => dispatch({
			type: FETCH_ARTICLESEARCHRESULTS,
			payload: searchResults,
			searchString: searchString
		}))
}

export const fetchDropdownSearchResults = (searchString = "") => dispatch => {
	const urlParameterStrings = {
		software: `search?text=${searchString}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=software`,
		service: `search?text=${searchString}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=service`,
		dataset: `search?text=${searchString}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=dataset`,
		articles: `articles?text=${searchString}`
	};

	let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
	const fetchOptions = {
		headers: new Headers({
			'Accept-Language': selectedLanguage
		})
	};

	const limitParameterString = 'limit=5';

	Object.keys(urlParameterStrings).forEach((searchResultsType) => {
		let urlParameterString = urlParameterStrings[searchResultsType];
		fetch(`https://kartkatalog.dev.geonorge.no/api/${urlParameterString}&${limitParameterString}`, fetchOptions)
			.then(res => res.json())
			.then(searchResults => dispatch({
				type: FETCH_DROPDOWNSEARCHRESULTS,
				payload: searchResults,
				searchString: searchString,
				searchResultsType: searchResultsType
			}))
	})
}
