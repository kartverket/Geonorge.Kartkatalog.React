import { FETCH_METADATASEARCHRESULTS, FETCH_ARTICLESEARCHRESULTS, FETCH_DROPDOWNSEARCHRESULTS, FETCH_AVAILABLEFACETS } from './types';

export const fetchMetadataSearchResults = (searchString = "", facets = null) => dispatch => {
	let facetsParameter = [];
	if(facets) {
		let facetIndex = 0;
		Object.keys(facets).map((facetField) => {
			facets[facetField].map((facet) => {
				facetsParameter.push(`facets[${facetIndex}]name=${facetField}&facets[${facetIndex}]value=${facet.Name}`);
				facetIndex++;
			})
		})
	}
	let facetsParameterString = facetsParameter.join('&');
	facetsParameterString = facetsParameterString ? "&" + facetsParameterString : "";

	fetch(`https://kartkatalog.dev.geonorge.no/api/search?text=${searchString}${facetsParameterString}`)
	.then(res => res.json())
	.then(searchResults => {
		dispatch({
		type: FETCH_METADATASEARCHRESULTS,
		payload: searchResults,
		searchString: searchString
		})
		let availableFacets = {};
		searchResults.Facets.map((facetFilterItem) => {
			availableFacets[facetFilterItem.FacetField] = facetFilterItem;
		})
		dispatch({
			type: FETCH_AVAILABLEFACETS,
			payload: availableFacets
		})
	})
}

export const fetchArticleSearchResults = (searchString = "") => dispatch => {
	fetch(`https://kartkatalog.dev.geonorge.no/api/articles?text=${searchString}`)
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
	
	Object.keys(urlParameterStrings).map((searchResultsType) => {
		let urlParameterString = urlParameterStrings[searchResultsType];
		fetch(`https://kartkatalog.dev.geonorge.no/api/${urlParameterString}`)
		.then(res => res.json())
		.then(searchResults => dispatch({
			type: FETCH_DROPDOWNSEARCHRESULTS,
			payload: searchResults,
			searchString: searchString,
			searchResultsType: searchResultsType
		}))
	})
}
