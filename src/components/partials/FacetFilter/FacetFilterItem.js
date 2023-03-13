// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

// Components
import Facet from "components/partials/FacetFilter/Facet";

// Actions
import { updateExpandedFacetFilters } from "actions/FacetFilterActions";

// Stylesheets
import style from "components/partials/FacetFilter/FacetFilterItem.module.scss";

const FacetFilterItem = ({searchData, facetFilterItem}) => {
    const dispatch = useDispatch();

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

    const getFacetResultsLength = (localFacetFilterItem = facetFilterItem, facetResultsLength = 0) => {
        localFacetFilterItem.FacetResults.forEach((facetResultItem) => {
            if (facetResultItem?.FacetResults?.length) {
                facetResultsLength = getFacetResultsLength(facetResultItem, facetResultsLength);
            }
            facetResultsLength += 1;
        });
        return facetResultsLength;
    };

    const renderList = (parentIsExpanded) => {
        if (facetFilterItem?.FacetResults?.length) {
            let facetElements = facetFilterItem.FacetResults.map((facet, i) => {
                return (
                    <Facet
                        facet={facet}
                        facetField={facetFilterItem.FacetField}
                        facetFieldNameTranslated={facetFilterItem.NameTranslated}
                        searchData={searchData}
                        parentIsExpanded={parentIsExpanded}
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

    return (
        <li className={isExpanded() ? style.filterItem : style.filterItem + " " + style.closed}>
            <FontAwesomeIcon onClick={toggleExpand} icon={isExpanded() ? "angle-up" : "angle-down"} className={style.expandArrow} />
            <p onClick={toggleExpand} className={style.filterName}>
                <span className={style.expandArrow}></span> {facetFilterItem.NameTranslated}
            </p>
            {renderList(isExpanded())}
        </li>
    );
};

FacetFilterItem.propTypes = {
    facetFilterItem: PropTypes.object.isRequired
};

export default FacetFilterItem;
