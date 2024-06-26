import {
    UPDATE_AVAILABLEFACETS,
    UPDATE_SELECTED_FACETS_FROM_URL,
    UPDATE_SELECTEDFACETS,
    UPDATE_EXPANDEDFACETFILTERS
} from "actions/types";
import { pushToDataLayer } from "reducers/TagManagerReducer";

export const updateAvailableFacets = (facets) => (dispatch) => {
    dispatch({
        type: UPDATE_AVAILABLEFACETS,
        payload: facets
    });
};

export const updateSelectedFacets = (facets) => (dispatch) => {
    dispatch({
        type: UPDATE_SELECTEDFACETS,
        payload: facets
    });
};

const addSelectedChildFacetsToAnalytics = (facet, facetType) => (dispatch) => {
    dispatch(
        pushToDataLayer({
            event: "updateSelectedFacets",
            category: "facets",
            activity: "addFacetType",
            facet: facetType
        })
    );
    dispatch(
        pushToDataLayer({
            event: "updateSelectedFacets",
            category: "facets",
            activity: "addFacet",
            facet: facet
        })
    );
    if (facet.facets && Object.keys(facet.facets).length) {
        Object.keys(facet.facets).forEach((childFacetKey) => {
            const childFacet = facet.facets[childFacetKey];
            addSelectedChildFacetsToAnalytics(childFacet, facetType);
        });
    }
};

export const addSelectedFacetsToAnalytics = (facets) => (dispatch) => {
    Object.keys(facets).forEach((facetTypeKey) => {
        const facetType = facets[facetTypeKey];
        Object.keys(facetType.facets).forEach((facetKey) => {
            const facet = facetType.facets[facetKey];
            dispatch(addSelectedChildFacetsToAnalytics(facet, facetType));
        });
    });
};

const findFacetInArray = (array, facetHierarchyForFacetValueArray, index = 0) => {
    let facetValue = index < facetHierarchyForFacetValueArray.length ? facetHierarchyForFacetValueArray[index] : null;
    let childFacetValue =
        index < facetHierarchyForFacetValueArray.length - 1 ? facetHierarchyForFacetValueArray[index + 1] : null;
    let facet = array.find((availableFacet) => {
        return availableFacet.Name === facetValue;
    });
    if (childFacetValue && facet?.FacetResults?.length) {
        facet.facets = {
            [childFacetValue]: findFacetInArray(facet.FacetResults, facetHierarchyForFacetValueArray, index + 1)
        };
    }else if (!facet?.FacetResults?.length) {
        console.log("no facet results for", facet)
    }
    return facet;
};

const addChildFacets = (facets, facetToAdd) => {
    if (!facets[facetToAdd.Name]) {
        // Creating facet/child facet e.g. dataset, service, 0/02, 0/02/0213 etc. if not created
        facets[facetToAdd.Name] = {
            ...facetToAdd,
            facets: {}
        };
    }
    if (facetToAdd.facets) {
        Object.keys(facetToAdd.facets).forEach((childFacetName) => {
            facets[facetToAdd.Name].facets = addChildFacets(
                facets[facetToAdd.Name].facets,
                facetToAdd.facets[childFacetName]
            ); // Recursively adding child facets to facet
        });
    }
    return facets;
};

export const updateSelectedFacetsFromUrl =
    (availableFacets = {}, url) =>
    (dispatch) => {
        const urlQueryArray = decodeURI(new URL(url).search).replace("?", "").split("&");
        let facets = {};
        urlQueryArray
            .filter((facetQuery) => {
                return facetQuery && facetQuery.length;
            })
            .forEach((facetQuery) => {
                let queryArray = facetQuery.split("=");
                if (queryArray.length === 2) {
                    let facetField = queryArray[0];
                    let facetValuesForFacetField = queryArray[1];
                    let facetValuesForFacetFieldArray = facetValuesForFacetField.split(",");
                    if (availableFacets[facetField]) {
                        facetValuesForFacetFieldArray.forEach((facetValue) => {
                            let facetHierarchyForFacetValueArray = facetValue.split("|");
                            let facet = availableFacets?.[facetField]?.FacetResults?.length
                                ? findFacetInArray(
                                      availableFacets[facetField].FacetResults,
                                      facetHierarchyForFacetValueArray
                                  )
                                : null;
                            if (facet) {
                                if (!facets[facetField]) {
                                    // Creating facet field e.g. Type, Theme, etc. if not created
                                    facets[facetField] = {
                                        facets: {},
                                        Name: facetField,
                                        NameTranslated: availableFacets[facetField].NameTranslated
                                    };
                                }
                                facets[facetField].facets = addChildFacets(facets[facetField].facets, facet); // Adding child facets to facet field
                            }
                        });
                    }
                } else {
                    console.warn("queryArray should have 2 values", queryArray);
                }
            });
        dispatch({
            type: UPDATE_SELECTED_FACETS_FROM_URL,
            payload: facets
        });
        return facets;
    };

export const updateExpandedFacetFilters = (expandedFacetFilters) => (dispatch) => {
    return dispatch({
        type: UPDATE_EXPANDEDFACETFILTERS,
        payload: expandedFacetFilters
    });
};
