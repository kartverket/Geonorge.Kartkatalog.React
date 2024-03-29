import { getKartkatalogApiUrl } from "actions/ApiUrlActions";
import {
    APPEND_TO_ARTICLESEARCHRESULTS,
    APPEND_TO_METADATASEARCHRESULTS,
    FETCH_ARTICLESEARCHRESULTS,
    FETCH_METADATASEARCHRESULTS
} from "actions/types";

const createChildFacetsArray = (selectedFacet, childFacetsArray = []) => {
    if (selectedFacet.facets && Object.keys(selectedFacet.facets).length) {
        Object.keys(selectedFacet.facets).forEach((childFacetName) => {
            const childFacet = selectedFacet.facets[childFacetName];
            if (childFacet.facets && Object.keys(childFacet.facets).length) {
                childFacetsArray = createChildFacetsArray(childFacet, childFacetsArray);
            }
            childFacetsArray.push(childFacet);
        });
    }
    return childFacetsArray;
};

export const fetchMetadataSearchResults =
    (searchString = "", facets = null, Offset = 1, append = false) =>
    (dispatch, getState) => {
        let facetsParameter = [];
        if (facets) {
            let facetIndex = 0;
            Object.keys(facets)
                .filter((facetField) => {
                    return (
                        Object.keys(facets[facetField]).length &&
                        facets[facetField].facets &&
                        Object.keys(facets[facetField].facets).length
                    );
                })
                .forEach((facetField) => {
                    Object.keys(facets[facetField].facets).forEach((facetName) => {
                        const selectedFacet = facets[facetField].facets[facetName];
                        const selectedChildFacetsArray = createChildFacetsArray(selectedFacet);
                        if (selectedChildFacetsArray.length) {
                            selectedChildFacetsArray.forEach((selectedChildFacet) => {
                                facetsParameter.push(
                                    `facets[${facetIndex}]name=${facetField}&facets[${facetIndex}]value=${selectedChildFacet.Name}`
                                );
                                facetIndex++;
                            });
                        }
                        facetsParameter.push(
                            `facets[${facetIndex}]name=${facetField}&facets[${facetIndex}]value=${facetName}`
                        );
                        facetIndex++;
                    });
                });
        }
        let facetsParameterString = facetsParameter.join("&");
        facetsParameterString = facetsParameterString ? "&" + facetsParameterString : "";

        const selectedLanguage = getState() && getState().selectedLanguage ? getState().selectedLanguage : "no";
        const fetchOptions = {
            headers: new Headers({
                "Accept-Language": selectedLanguage
            })
        };
        const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
        return fetch(
            `${kartkatalogApiUrl}/search?limit=25&offset=${Offset}&text=${searchString}${facetsParameterString}`,
            fetchOptions
        )
            .then((res) => res.json())
            .then((searchResults) => {
                localStorage.setItem(
                    "urlDownloadCsv",
                    `${kartkatalogApiUrl}/search?limit=10000&text=${searchString}${facetsParameterString}&mediatype=csv`
                );
                return dispatch({
                    type: append ? APPEND_TO_METADATASEARCHRESULTS : FETCH_METADATASEARCHRESULTS,
                    payload: searchResults,
                    searchString: searchString
                });
            });
    };

export const fetchArticleSearchResults =
    (searchString = "", Offset = 1, append = false) =>
    (dispatch, getState) => {
        const selectedLanguage = getState() && getState().selectedLanguage ? getState().selectedLanguage : "no";
        const fetchOptions = {
            headers: new Headers({
                "Accept-Language": selectedLanguage
            })
        };
        const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
        return fetch(`${kartkatalogApiUrl}/articles?limit=25&offset=${Offset}&text=${searchString}`, fetchOptions)
            .then((res) => res.json())
            .then((searchResults) =>
                dispatch({
                    type: append ? APPEND_TO_ARTICLESEARCHRESULTS : FETCH_ARTICLESEARCHRESULTS,
                    payload: searchResults,
                    searchString: searchString
                })
            );
    };
