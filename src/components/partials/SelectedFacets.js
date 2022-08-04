// Dependencies
import React, { Component } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Helpers
import { getQueryStringFromFacets } from "helpers/FacetFilterHelpers";

// Stylesheets
import style from "components/partials/SelectedFacets.module.scss";

const SelectedFacets = () => {
    // Redux store
    const selectedFacets = useSelector((state) => state.selectedFacets);
    const searchString = useSelector((state) => state.searchString);

    const renderSelectedFacetsList = () => {
        if (selectedFacets && Object.keys(selectedFacets).length) {
            return Object.keys(selectedFacets).map((facetTypeName) => {
                const facetType = selectedFacets[facetTypeName];
                return renderSelectedFacetType(facetType);
            });
        }
    };

    const renderSelectedFacetType = (facetType, childFacet) => {
        if (facetType.facets && Object.keys(facetType.facets).length) {
            return Object.keys(facetType.facets).map((facetTypeKey) => {
                const facet = childFacet ? childFacet : facetType.facets[facetTypeKey];
                const hasChildren = facet.facets && Object.keys(facet.facets).length;
                let childFacetElements = [];
                if (hasChildren) {
                    const childFacets = facet.facets;
                    Object.keys(childFacets).forEach((childFacetKey) => {
                        const childFacet = childFacets[childFacetKey];
                        childFacetElements.push(renderSelectedFacetType(facetType, childFacet));
                    });
                }
                return (
                    <div key={facet.Name} className={style.facet}>
                        {childFacetElements}
                        <span>
                            {facet.NameTranslated}{" "}
                            <Link to={getRemoveFacetQueryString(facet, facetType.Name)}>
                                <FontAwesomeIcon title={"Fjern"} icon={["fas", "times"]} />
                            </Link>
                        </span>
                    </div>
                );
            });
        }
    };

    const getRemoveFacetQueryString = (facet, facetField) => {
        return getQueryStringFromFacets(selectedFacets, searchString, {
            facetToRemove: {
                facetField,
                facet
            }
        });
    };

    return <div>{renderSelectedFacetsList()}</div>;
};

export default SelectedFacets;
