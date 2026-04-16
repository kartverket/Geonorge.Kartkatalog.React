// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

// Components
import Facet from "@/components/partials/FacetFilter/Facet";

// Actions
import { updateExpandedFacetFilters } from "@/actions/FacetFilterActions";

// Stylesheets
import style from "@/components/partials/FacetFilter/FacetFilterItem.module.scss";

const FacetFilterItem = ({ searchData, facetFilterItem, viewMode }) => {
    const dispatch = useDispatch();
    const [organizationFilter, setOrganizationFilter] = useState("");

    // Redux store
    const expandedFacetFilters = useSelector((state) => state.expandedFacetFilters);

    const toggleExpand = () => {
        const isExpanded = expandedFacetFilters?.[facetFilterItem.FacetField];

        const newExpandedFacetFilters = {
            ...expandedFacetFilters,
            [facetFilterItem.FacetField]: !isExpanded
        };
        dispatch(updateExpandedFacetFilters(newExpandedFacetFilters));
    };

    const handleOrganizationFilterChange = (event) => {
        setOrganizationFilter(event.target.value);
    };

    const getFilteredFacetResults = (facetResults) => {
        if (facetFilterItem.Name === "organizations" && organizationFilter.trim()) {
            return facetResults.filter((facet) => 
                facet.Name?.toLowerCase().includes(organizationFilter.toLowerCase().trim())
            );
        }
        return facetResults;
    };

    const getFacetResultsLength = (localFacetFilterItem = facetFilterItem, facetResultsLength = 0) => {
        const results = getFilteredFacetResults(localFacetFilterItem.FacetResults);
        results.forEach((facetResultItem) => {
            if (facetResultItem?.FacetResults?.length) {
                facetResultsLength = getFacetResultsLength(facetResultItem, facetResultsLength);
            }
            facetResultsLength += 1;
        });
        return facetResultsLength;
    };

    const renderList = (parentIsExpanded, labelId) => {
        if (facetFilterItem?.FacetResults?.length) {
            const filteredResults = getFilteredFacetResults(facetFilterItem.FacetResults);
            let facetElements = filteredResults.map((facet, i) => {
                return (
                    <Facet
                        facet={facet}
                        facetField={facetFilterItem.FacetField}
                        facetFieldNameTranslated={facetFilterItem.NameTranslated}
                        searchData={searchData}
                        parentIsExpanded={parentIsExpanded}
                        labelId={labelId}
                        viewMode={viewMode}
                        key={i}
                    />
                );
            });
            const listElementHeight = 28.5;
            const facetResultsLength = getFacetResultsLength();
            const listHeight = facetResultsLength * listElementHeight;
            return React.createElement(
                "ul",
                {
                    className: style.facets,
                    style: {
                        maxHeight: `${listHeight}px`
                    }
                },
                facetElements
            );
        }
    };

    const isExpanded = () => {
        return !!expandedFacetFilters?.[facetFilterItem.FacetField];
    };

    const labelId = `facet-label-${facetFilterItem.Name}`;
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    return (
        <li className={isExpanded() ? style.filterItem : style.filterItem + " " + style.closed}>
            <button onClick={toggleExpand} className={style.expandButton} aria-expanded={isExpanded()}>
                <FontAwesomeIcon icon={isExpanded() ? "angle-up" : "angle-down"} className={style.expandArrow} />
                <p className={style.filterName}>
                    <span className={style.expandArrow}></span> <span id={labelId}>{facetFilterItem.NameTranslated}</span>
                </p>
            </button>
            {facetFilterItem.Name === "organizations" && isExpanded() && (
                <input 
                    type="text" 
                    id="filter-organizations" 
                    className={style.filterInput} 
                    placeholder={selectedLanguage == "no" ? "Søk på organisasjon..." : "Search for organization..."} 
                    value={organizationFilter}
                    onChange={handleOrganizationFilterChange}
                />
            )}
            {renderList(isExpanded(), labelId)}
        </li>
    );
};

FacetFilterItem.propTypes = {
    facetFilterItem: PropTypes.object.isRequired,
    searchData: PropTypes.object,
    viewMode: PropTypes.oneOf("grid","list")
};

export default FacetFilterItem;
