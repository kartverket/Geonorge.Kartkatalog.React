import * as Cookies from 'js-cookie';
import {getKartkatalogApiUrl} from './ApiUrlActions';
import {
    APPEND_TO_ARTICLESEARCHRESULTS,
    APPEND_TO_METADATASEARCHRESULTS,
    FETCH_ARTICLESEARCHRESULTS,
    FETCH_DROPDOWNSEARCHRESULTS,
    FETCH_METADATASEARCHRESULTS
} from './types';

const createChildFacetsArray = (selectedFacet, childFacetsArray = []) => {
    if (selectedFacet.facets && Object.keys(selectedFacet.facets).length) {
        Object.keys(selectedFacet.facets).forEach(childFacetName => {
            const childFacet = selectedFacet.facets[childFacetName];
            if (childFacet.facets && Object.keys(childFacet.facets).length) {
                childFacetsArray = createChildFacetsArray(childFacet, childFacetsArray);
            }
            childFacetsArray.push(childFacet);
        })
    }
    return childFacetsArray;
};

export const fetchMetadataSearchResults = (searchString = "", facets = null, Offset = 1, append = false) => dispatch => {
    let facetsParameter = [];
    if (facets) {
        let facetIndex = -1;
        Object.keys(facets).filter((facetField) => {
            return Object.keys(facets[facetField]).length && facets[facetField].facets && Object.keys(facets[facetField].facets).length;
        }).forEach((facetField) => {
            Object.keys(facets[facetField].facets).forEach((facetName) => {
                const selectedFacet = facets[facetField].facets[facetName];
                const selectedChildFacetsArray = createChildFacetsArray(selectedFacet);
                if (selectedChildFacetsArray.length) {
                    selectedChildFacetsArray.forEach( selectedChildFacet => {
                        facetsParameter.push(`facets[${facetIndex}]name=${facetField}&facets[${facetIndex}]value=${selectedChildFacet.Name}`);
                        facetIndex++;
                    })
                }
                facetIndex++;
                facetsParameter.push(`facets[${facetIndex}]name=${facetField}&facets[${facetIndex}]value=${facetName}`);
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
    const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
    return fetch(`${kartkatalogApiUrl}/search?limit=25&offset=${Offset}&text=${searchString}${facetsParameterString}`, fetchOptions)
        .then(res => res.json())
        .then(searchResults => {
            dispatch({
                type: append ? APPEND_TO_METADATASEARCHRESULTS : FETCH_METADATASEARCHRESULTS,
                payload: searchResults,
                searchString: searchString,
            });
        })
};


export const fetchArticleSearchResults = (searchString = "", Offset = 1, append = false) => dispatch => {
    let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };
    const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
    return fetch(`${kartkatalogApiUrl}/articles?limit=25&offset=${Offset}&text=${searchString}`, fetchOptions)
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
        const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
        let urlParameterString = urlParameterStrings[searchResultsType];
        return fetch(`${kartkatalogApiUrl}/${urlParameterString}&${limitParameterString}`, fetchOptions)
            .then(res => res.json())
            .then(searchResults => dispatch({
                type: FETCH_DROPDOWNSEARCHRESULTS,
                payload: searchResults,
                searchString: searchString,
                searchResultsType: searchResultsType
            }))
    }))
};
