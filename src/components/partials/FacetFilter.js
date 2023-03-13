// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import FacetFilterItem from "components/partials/FacetFilter/FacetFilterItem";
import { ErrorBoundary } from "components/ErrorBoundary";

// Stylesheets
import style from "components/partials/FacetFilter.module.scss";

export const FacetFilter = ({ searchData }) => {
    // State
    const [expanded, setExpanded] = useState();

    const toggleFacets = () => {
        setExpanded(!expanded);
    };

    const renderFacets = () => {
        const togglefacetClassnames = classNames({
            [style.facetFilter]: true,
            [style.open]: expanded
        });

        const facets =
            searchData?.availableFacets && Object.keys(searchData.availableFacets).length
                ? Object.keys(searchData.availableFacets).map((facetField) => {
                      return searchData.availableFacets[facetField] ? (
                          <ErrorBoundary key={facetField}>
                              <FacetFilterItem
                                  searchData={searchData}
                                  facetFilterItem={searchData.availableFacets[facetField]}
                              />
                          </ErrorBoundary>
                      ) : null;
                  })
                : null;
        return (
            <div className={togglefacetClassnames}>
                <label className={style.showLabel}>Valgte filter:</label>
                <ul>{facets}</ul>
            </div>
        );
    };

    return (
        <div>
            <div className={style.togglefacet} onClick={() => toggleFacets()}>
                <FontAwesomeIcon icon={expanded ? ["fas", "times"] : ["far", "filter"]} />
            </div>
            {renderFacets()}
        </div>
    );
};

// Validering av props...
FacetFilter.propTypes = {
    searchData: PropTypes.object
};

export default FacetFilter;
