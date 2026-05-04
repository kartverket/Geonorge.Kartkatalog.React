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

const getFacetParentChain = (facet) => {
    const parents = [];
    let currentParent = facet?.parent;

    while (currentParent?.facet) {
        parents.unshift(currentParent.facet);
        currentParent = currentParent.facet?.parent;
    }

    return parents;
};

const createSelectedFacetNode = (facet, facets) => {
    return {
        Name: facet.Name,
        NameTranslated: facet.NameTranslated,
        Count: facet.Count,
        ...(facets ? { facets } : {})
    };
};

const getNextSelectedFacetState = (selectedFacets = {}, facetField, options = {}) => {
    const { createIfMissing = false } = options;
    const nextSelectedFacets = { ...selectedFacets };
    const existingFacetSelection = selectedFacets[facetField];

    if (!existingFacetSelection) {
        if (!createIfMissing) {
            return {
                nextSelectedFacets,
                facetSelection: null
            };
        }

        const facetSelection = {
            facetField,
            facets: {}
        };

        nextSelectedFacets[facetField] = facetSelection;

        return {
            nextSelectedFacets,
            facetSelection
        };
    }

    const facetSelection = {
        ...existingFacetSelection,
        facets: existingFacetSelection.facets ? { ...existingFacetSelection.facets } : {}
    };

    nextSelectedFacets[facetField] = facetSelection;

    return {
        nextSelectedFacets,
        facetSelection
    };
};

export const getActiveFiltersFromSelectedFacets = (selectedFacets = {}) => {
    const activeFilters = [];

    const flattenFacets = (facets, fieldName) => {
        Object.values(facets || {}).forEach((facet) => {
            activeFilters.push(`${fieldName}: ${facet.NameTranslated || facet.Name}`);

            if (facet.facets && Object.keys(facet.facets).length > 0) {
                flattenFacets(facet.facets, fieldName);
            }
        });
    };

    Object.keys(selectedFacets || {}).forEach((fieldKey) => {
        if (selectedFacets[fieldKey]?.facets) {
            flattenFacets(selectedFacets[fieldKey].facets, fieldKey);
        }
    });

    return activeFilters;
};

export const getNextSelectedFacetsFromFacetToggle = (selectedFacets = {}, facetField, facet, action) => {
    const parentChain = getFacetParentChain(facet);

    if (action === 'add') {
        const { nextSelectedFacets, facetSelection } = getNextSelectedFacetState(selectedFacets, facetField, { createIfMissing: true });
        let currentFacets = facetSelection.facets;

        parentChain.forEach((parentFacet) => {
            const existingParentNode = currentFacets[parentFacet.Name];

            currentFacets[parentFacet.Name] = existingParentNode
                ? {
                    ...existingParentNode,
                    facets: existingParentNode.facets ? { ...existingParentNode.facets } : {}
                }
                : createSelectedFacetNode(parentFacet, {});

            currentFacets = currentFacets[parentFacet.Name].facets;
        });

        currentFacets[facet.Name] = createSelectedFacetNode(facet, currentFacets[facet.Name]?.facets);

        return nextSelectedFacets;
    }

    if (action === 'remove') {
        const { nextSelectedFacets, facetSelection } = getNextSelectedFacetState(selectedFacets, facetField);

        if (!facetSelection) {
            return nextSelectedFacets;
        }

        const facetContainers = [facetSelection.facets];
        let currentFacets = facetSelection.facets;

        for (const parentFacet of parentChain) {
            const existingParentNode = currentFacets[parentFacet.Name];

            if (!existingParentNode?.facets) {
                return nextSelectedFacets;
            }

            currentFacets[parentFacet.Name] = {
                ...existingParentNode,
                facets: { ...existingParentNode.facets }
            };

            currentFacets = currentFacets[parentFacet.Name].facets;
            facetContainers.push(currentFacets);
        }

        delete currentFacets[facet.Name];

        for (let index = parentChain.length - 1; index >= 0; index -= 1) {
            const parentContainer = facetContainers[index];
            const parentFacetName = parentChain[index].Name;
            const parentNode = parentContainer[parentFacetName];

            if (parentNode?.facets && !Object.keys(parentNode.facets).length) {
                delete parentContainer[parentFacetName];
            } else {
                break;
            }
        }

        if (!Object.keys(facetSelection.facets).length) {
            delete nextSelectedFacets[facetField];
        }

        return nextSelectedFacets;
    }

    return selectedFacets;
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


    if (options.view) {
        queryStringFromFacets += queryStringFromFacets
            ? `&view=${options.view}`
            : `?view=${options.view}`;
}
    return queryStringFromFacets;
};
