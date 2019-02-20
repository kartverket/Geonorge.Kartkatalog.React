import * as Cookies from 'js-cookie';
import {
    FETCH_METADATASEARCHRESULTS,
    FETCH_ARTICLESEARCHRESULTS,
    FETCH_DROPDOWNSEARCHRESULTS,
    FETCH_AVAILABLEFACETS,
    APPEND_TO_METADATASEARCHRESULTS,
    APPEND_TO_ARTICLESEARCHRESULTS
} from './types';

export const fetchMetadataSearchResults = (searchString = "", facets = null, Offset = 1, append = false) => dispatch => {
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

    return fetch(`https://kartkatalog.dev.geonorge.no/api/search?offset=${Offset}&text=${searchString}${facetsParameterString}&orderby=updated`, fetchOptions)
        .then(res => res.json())
        .then(searchResults => {
            dispatch({
                type: append ? APPEND_TO_METADATASEARCHRESULTS : FETCH_METADATASEARCHRESULTS,
                payload: searchResults,
                searchString: searchString,
            });
            let availableFacets = {};
            searchResults.Facets.forEach((facetFilterItem) => {
                availableFacets[facetFilterItem.FacetField] = facetFilterItem;
            });
            dispatch({
                type: FETCH_AVAILABLEFACETS,
                payload: availableFacets
            })
        })
};


export const fetchArticleSearchResults = (searchString = "", Offset = 1, append = false) => dispatch => {
    let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };

    return fetch(`https://kartkatalog.dev.geonorge.no/api/articles?offset=${Offset}&text=${searchString}`, fetchOptions)
        .then(res => res.json())
        .then(searchResults => dispatch({
            type: append ? APPEND_TO_ARTICLESEARCHRESULTS : FETCH_ARTICLESEARCHRESULTS,
            payload: searchResults,
            searchString: searchString
        }))
};

export const fetchDropdownSearchResults = (searchString = "") => async dispatch => {
    const urlParameterStrings = {
        dataset: `search?text=${searchString}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=dataset`,
        service: `search?text=${searchString}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=service`,
        software: `search?text=${searchString}&facets%5B1%5Dname=type&facets%5B1%5Dvalue=software`,
        articles: `articles?text=${searchString}`
    };
    let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };
    const limitParameterString = 'limit=5';

    await Promise.all(Object.keys(urlParameterStrings).map(async (searchResultsType) => {
        let urlParameterString = urlParameterStrings[searchResultsType];
        return fetch(`https://kartkatalog.dev.geonorge.no/api/${urlParameterString}&${limitParameterString}`, fetchOptions)
            .then(res => res.json())
            .then(searchResults => dispatch({
                type: FETCH_DROPDOWNSEARCHRESULTS,
                payload: searchResults,
                searchString: searchString,
                searchResultsType: searchResultsType
            }))
    }))
};
