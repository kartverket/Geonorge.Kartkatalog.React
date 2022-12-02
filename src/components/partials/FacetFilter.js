// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import FacetFilterItem from "components/partials/FacetFilter/FacetFilterItem";
import { ErrorBoundary } from "components/ErrorBoundary";

// Stylesheets
import style from "components/partials/FacetFilter.module.scss";

export const FacetFilter = () => {
    // Redux store
    const availableFacets = useSelector((state) => state.availableFacets);

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
            availableFacets && Object.keys(availableFacets).length
                ? Object.keys(availableFacets).map((facetField) => {
                      return availableFacets[facetField] 
                      ? (
                          <ErrorBoundary key={facetField}>
                              <FacetFilterItem facetFilterItem={availableFacets[facetField]} />
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
    searchResults: PropTypes.object
};

export default FacetFilter;
