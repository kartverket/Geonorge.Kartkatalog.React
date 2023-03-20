// Dependencies
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { GnSrOnly } from "@kartverket/geonorge-web-components";

// Helpers
import { getQueryStringFromFacets } from "helpers/FacetFilterHelpers";

// Stylesheets
import style from "components/partials/SelectedFacets.module.scss";

const SelectedFacets = ({ searchData }) => {
    const renderSelectedFacetsList = (selectedFacets) => {
        if (selectedFacets && Object.keys(selectedFacets).length) {
            return Object.keys(selectedFacets).map((facetTypeName) => {
                const facetType = selectedFacets[facetTypeName];
                return renderSelectedFacetType(facetType);
            });
        }
    };

    const renderFacets = (facets) => {
        return facets && Object.keys(facets)?.length
            ? Object.keys(facets).map((facetKey) => {
                  const facet = facets[facetKey];
                  const hasChildren = facet?.facets && Object.keys(facet.facets)?.length;
                  return (
                      <Fragment key={facetKey}>
                          <div className={style.selectedFacet}>
                              {facet.NameTranslated}{" "}
                              <Link to={getRemoveFacetQueryString(facet, facet.Name)}>
                                  <gn-sr-only>Fjern filter {facet.NameTranslated}</gn-sr-only>
                                  <FontAwesomeIcon alt="" icon={["fas", "times"]} />
                              </Link>
                          </div>
                          {hasChildren ? renderFacets(facet.facets) : null}
                      </Fragment>
                  );
              })
            : null;
    };

    const renderSelectedFacetType = (facetType) => {
        return renderFacets(facetType.facets);
    };

    const getRemoveFacetQueryString = (facet, facetField) => {
        return getQueryStringFromFacets(searchData?.selectedFacets, searchData?.searchString, {
            facetToRemove: {
                facetField,
                facet
            }
        });
    };

    return <div className={style.selectedFacets}>{renderSelectedFacetsList(searchData.selectedFacets)}</div>;
};

export default SelectedFacets;
