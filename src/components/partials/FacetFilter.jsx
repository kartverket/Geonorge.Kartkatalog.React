// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { XMarkIcon, FilterIcon } from "@navikt/aksel-icons";

// Components
import FacetFilterItem from "@/components/partials/FacetFilter/FacetFilterItem";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Stylesheets
import style from "@/components/partials/FacetFilter.module.scss";

export const FacetFilter = ({ searchData, viewMode }) => {
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
                                  viewMode={viewMode}
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
                {expanded ? <XMarkIcon aria-hidden="true" /> : <FilterIcon aria-hidden="true" />}
            </div>
            {renderFacets()}
        </div>
    );
};

// Validering av props...
FacetFilter.propTypes = {
    searchData: PropTypes.object,
    viewMode: PropTypes.oneOf(["grid", "list"])
};

export default FacetFilter;
