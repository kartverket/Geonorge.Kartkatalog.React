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

const FacetFilterItem = (props) => {
    const dispatch = useDispatch();

    // Redux store
    const expandedFacetFilters = useSelector((state) => state.expandedFacetFilters);

    const toggleExpand = () => {
        const isExpanded = expandedFacetFilters?.[props.facetFilterItem.FacetField];

        const newExpandedFacetFilters = {
            ...expandedFacetFilters,
            [props.facetFilterItem.FacetField]: !isExpanded
        };
        dispatch(updateExpandedFacetFilters(newExpandedFacetFilters));
    };

    const getFacetResultsLength = (facetFilterItem = props.facetFilterItem, facetResultsLength = 0) => {
        facetFilterItem.FacetResults.forEach((facetResultItem) => {
            if (facetResultItem?.FacetResults?.length) {
                facetResultsLength = getFacetResultsLength(facetResultItem, facetResultsLength);
            }
            facetResultsLength += 1;
        });
        return facetResultsLength;
    };

    const renderList = () => {
        if (props.facetFilterItem?.FacetResults?.length) {
            let facetElements = props.facetFilterItem.FacetResults.map((facet, i) => {
                return (
                    <Facet
                        facet={facet}
                        facetField={props.facetFilterItem.FacetField}
                        facetFieldNameTranslated={props.facetFilterItem.NameTranslated}
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
        return !!expandedFacetFilters?.[props.facetFilterItem.FacetField];
    };

    return (
        <li className={isExpanded() ? style.filterItem : style.filterItem + " " + style.closed}>
            <FontAwesomeIcon onClick={toggleExpand} icon={isExpanded() ? "angle-up" : "angle-down"} className={style.expandArrow} />
            <p onClick={toggleExpand} className={style.filterName}>
                <span className={style.expandArrow}></span> {props.facetFilterItem.NameTranslated}
            </p>
            {renderList()}
        </li>
    );
};

FacetFilterItem.propTypes = {
    facetFilterItem: PropTypes.object.isRequired
};

export default FacetFilterItem;
