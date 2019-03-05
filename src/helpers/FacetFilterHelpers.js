const getChildFacetsName = (facet, facetField, options = {}) => {
    let queryString = '';
    let parentFacetQueryString = `${facetField}=${facet.Name}`;
    let childFacets = facet.facets;
    Object.keys(childFacets).forEach((childFacetName, index) => {
        if (childFacets[childFacetName].facets && Object.keys(childFacets[childFacetName].facets).length) {
            // TODO add support for additional stages
        } else {
            let facetShouldBeRemoved = options.facetToRemove && options.facetToRemove.facet.Name === childFacets[childFacetName].Name;
            if (!facetShouldBeRemoved) {
                queryString += parentFacetQueryString + '|' + childFacets[childFacetName].Name;
                queryString += index < Object.keys(childFacets).length - 1 ? '&' : ''; // Add trailing '&' to each except last
            }
        }
    });
    return queryString;
};

export const getQueryStringFromFacets = (selectedFacets = {}, searchString, options = {}) => {

    let queryStringFromFacets = searchString ? `?text=${searchString}` : '';
    if (Object.keys(selectedFacets).length) {
        Object.keys(selectedFacets).forEach(facetField => {
            if (selectedFacets[facetField].facets) {
                Object.keys(selectedFacets[facetField].facets).forEach(facetName => {
                    let hasChildren = selectedFacets[facetField].facets[facetName].facets && Object.keys(selectedFacets[facetField].facets[facetName].facets).length;
                    let facetShouldBeRemoved = options.facetToRemove && options.facetToRemove.facet.Name === facetName;
                    if (!facetShouldBeRemoved) {
                        if (hasChildren) {
                            queryStringFromFacets += queryStringFromFacets
                                ? `&${getChildFacetsName(selectedFacets[facetField].facets[facetName], facetField, options)}`
                                : `?${getChildFacetsName(selectedFacets[facetField].facets[facetName], facetField, options)}`
                        } else {
                            queryStringFromFacets += queryStringFromFacets
                                ? `&${facetField}=${facetName}`
                                : `?${facetField}=${facetName}`
                        }
                    }
                })
            }
        });
    }

    if (options.facetToAdd) {
        let hasParent = options.facetToAdd.facet.parent && Object.keys(options.facetToAdd.facet.parent).length;
        if (hasParent) {
            queryStringFromFacets += queryStringFromFacets
                ? `&${options.facetToAdd.facet.parent.facetField}=${options.facetToAdd.facet.parent.facet.Name}|${options.facetToAdd.facet.Name}`
                : `?${options.facetToAdd.facet.parent.facetField}=${options.facetToAdd.facet.parent.facet.Name}|${options.facetToAdd.facet.Name}`
        } else {
            queryStringFromFacets += queryStringFromFacets
                ? `&${options.facetToAdd.facetField}=${options.facetToAdd.facet.Name}`
                : `?${options.facetToAdd.facetField}=${options.facetToAdd.facet.Name}`
        }
    }
    return queryStringFromFacets;
};
