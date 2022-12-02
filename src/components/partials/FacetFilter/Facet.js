// Dependencies
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

// Reducers
import { pushToDataLayer } from "reducers/TagManagerReducer";

// Helpers
import { getQueryStringFromFacets } from "helpers/FacetFilterHelpers";

// Components
import { ErrorBoundary } from "components/ErrorBoundary";

// Stylesheets
import style from "components/partials/FacetFilter/Facet.module.scss";

const Facet = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux store
    const selectedFacets = useSelector((state) => state.selectedFacets);
    const searchString = useSelector((state) => state.searchString);

    // State
    const [checked, setChecked] = useState(false);

    const getParentFacets = (facet, parents = []) => {
        const hasParent = !!facet.parent && !!Object.keys(facet.parent).length;
        if (hasParent) {
            parents.push(facet.parent);
            if (getParentFacets(facet.parent)) {
                getParentFacets(facet.parent, parents);
            }
        } else {
            return false;
        }
        return parents.reverse();
    };

    const getClosestParentSelectedFacetsArray = (parents, facets, index = 0) => {
        facets = facets ? facets : selectedFacets[props.facetField].facets;
        if (facets && parents?.length) {
            if (index < parents.length - 1) {
                getClosestParentSelectedFacetsArray(parents, facets[parents[index].facet.Name].facets, index + 1);
            }
            const hasSelectedFacets = facets[parents[index].facet.Name] && facets[parents[index].facet.Name].facets;
            if (hasSelectedFacets) {
                return facets[parents[index].facet.Name].facets;
            } else {
                return null;
            }
        } else {
            return facets;
        }
    };

    const isChecked = () => {
        const hasSelectedFacets = !!selectedFacets?.[props.facetField]?.facets;
        if (hasSelectedFacets) {
            let isChecked = false;
            const parents = getParentFacets(props.facet);
            const closestSelectedFacetsArray = getClosestParentSelectedFacetsArray(parents);
            if (!!closestSelectedFacetsArray && !!Object.keys(closestSelectedFacetsArray)?.length) {
                Object.keys(closestSelectedFacetsArray).forEach((selectedFacetName) => {
                    if (selectedFacetName === props.facet.Name) {
                        isChecked = true;
                    }
                });
            }
            if (isChecked) {
                setChecked(true);
            } else {
                setChecked(false);
            }
        } else {
            setChecked(false);
        }
    };

    useEffect(() => {
        isChecked();
    }, []);

    const renderList = (facets) => {
        if (facets) {
            const ulClassNames = classNames({
                [style.filterItems]: true,
                [style.hidden]: !checked
            });
            const filterItemElements = facets.map((facet, i) => {
                return (
                    <ErrorBoundary key={i}>
                        <Facet {...props} facet={{ ...facet, parent: props }} key={i} />
                    </ErrorBoundary>
                );
            });
            return React.createElement("ul", { className: ulClassNames }, filterItemElements);
        } else {
            return null;
        }
    };

    useEffect(() => {
        isChecked();
    }, [selectedFacets]);

    const getAddFacetQueryString = () => {
        return getQueryStringFromFacets(selectedFacets, searchString, {
            facetToAdd: {
                facetField: props.facetField,
                facet: props.facet
            }
        });
    };

    const getRemoveFacetQueryString = () => {
        return getQueryStringFromFacets(selectedFacets, searchString, {
            facetToRemove: {
                facetField: props.facetField,
                facet: props.facet
            }
        });
    };

    const handleFacetClick = () => {
        dispatch(
            pushToDataLayer({
                event: "updateSelectedFacets",
                category: "facets",
                activity: "addFacetType",
                facet: { NameTranslated: props.facetFieldNameTranslated }
            })
        );
        dispatch(
            pushToDataLayer({
                event: "updateSelectedFacets",
                category: "facets",
                activity: "addFacet",
                facet: props.facet
            })
        );
        navigate(checked ? getRemoveFacetQueryString() : getAddFacetQueryString());
    };

    const renderFacet = () => {
        const liClassNames = classNames({
            [style.facet]: true,
            [style.empty]: props.facet.Count === 0
        });

        return checked || props.facet.Count ? (
            <li className={liClassNames}>
                <span onClick={handleFacetClick} className={style.clickable}>
                    <FontAwesomeIcon
                        className={style.svgCheckbox}
                        icon={checked ? ["far", "check-square"] : ["far", "square"]}
                    />
                    <label htmlFor={props.facet.Name}>
                        <span>{props.facet.NameTranslated} </span>
                        <span>({props.facet.Count})</span>
                    </label>
                </span>
                {renderList(props.facet.FacetResults)}
            </li>
        ) : (
            ""
        );
    };

    return renderFacet();
};

Facet.propTypes = {
    facetField: PropTypes.string.isRequired,
    facetFieldNameTranslated: PropTypes.string.isRequired,
    facet: PropTypes.shape({
        Count: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        NameTranslated: PropTypes.string.isRequired
    })
};

export default Facet;
