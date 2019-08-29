import { UPDATE_AVAILABLEFACETS, UPDATE_SELECTED_FACETS_FROM_URL, UPDATE_SELECTEDFACETS } from '../actions/types';

export const updateAvailableFacets = (facets) => dispatch => {
    dispatch({
        type: UPDATE_AVAILABLEFACETS,
        payload: facets,
    })
};

export const updateSelectedFacets = (facets) => dispatch => {
    dispatch({
        type: UPDATE_SELECTEDFACETS,
        payload: facets,
    })
};

const findFacetInArray = (array, facetHierarchyForFacetValueArray, index = 0) => {
    let facetValue = index < facetHierarchyForFacetValueArray.length ? facetHierarchyForFacetValueArray[index] : null;
    let childFacetValue = index < facetHierarchyForFacetValueArray.length - 1 ? facetHierarchyForFacetValueArray[index + 1] : null;
    let facet = array.find(availableFacet => {
        return availableFacet.Name === facetValue;
    });
    if (childFacetValue) {
        facet.facets = {
            [childFacetValue]: findFacetInArray(facet.FacetResults, facetHierarchyForFacetValueArray, index + 1)
        }
    }
    return facet;
};

const addChildFacets = (facets, facetToAdd) => {
    if (!facets[facetToAdd.Name]) { // Creating facet/child facet e.g. dataset, service, 0/02, 0/02/0213 etc. if not created
        facets[facetToAdd.Name] = {
            ...facetToAdd,
            facets: {}
        };
    }
    if (facetToAdd.facets) {
        Object.keys(facetToAdd.facets).forEach(childFacetName => {
            facets[facetToAdd.Name].facets = addChildFacets(facets[facetToAdd.Name].facets, facetToAdd.facets[childFacetName]); // Recursively adding child facets to facet
        })
    }
    return facets;
};

export const updateSelectedFacetsFromUrl = (availableFacets = {}) => dispatch => {
    const urlQueryArray = decodeURI(window.location.search).replace('?', '').split('&');

    let facets = {};

    urlQueryArray.filter(facetQuery => {
        return facetQuery && facetQuery.length;
    }).forEach(facetQuery => {
        let queryArray = facetQuery.split('=');
        if (queryArray.length === 2) {
            let facetField = queryArray[0];
            let facetValuesForFacetField = queryArray[1];
            let facetValuesForFacetFieldArray = facetValuesForFacetField.split(',');
            if (availableFacets[facetField]) {
                facetValuesForFacetFieldArray.forEach(facetValue => {
                    let facetHierarchyForFacetValueArray = facetValue.split('|');
                    let facet = availableFacets[facetField] ? findFacetInArray(availableFacets[facetField].FacetResults, facetHierarchyForFacetValueArray) : null;
                    if (facet) {
                        if (!facets[facetField]) { // Creating facet field e.g. Type, Theme, etc. if not created
                            facets[facetField] = {
                                facets: {},
                                Name: facetField
                            };
                        }
                        facets[facetField].facets = addChildFacets(facets[facetField].facets, facet); // Adding child facets to facet field
                    }
                })
            }
        } else {
            console.warn("queryArray should have 2 values", queryArray);
        }

    });
    return dispatch({
        type: UPDATE_SELECTED_FACETS_FROM_URL,
        payload: facets,
    });
};
