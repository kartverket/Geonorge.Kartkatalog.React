// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { getResource } from "actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "reducers/TagManagerReducer";

// Stylesheets
import style from "components/partials/Buttons/Buttons.module.scss";

const ProductSpecificationButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };
        dispatch(
            pushToDataLayer({
                event: "showMore",
                category: "metadataDetails",
                activity: "showProductSpecification",
                metadata: tagData
            })
        );
    };

    const buttonDescription = dispatch(getResource("DisplayProductSpecification", "Vis produktspesifikasjon"));
    const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "file-spreadsheet"]} key="icon" />;
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const childElements = [icon, textContent];
    if (props.metadata.ProductSpecificationUrl) {
        const url = props.metadata.ProductSpecificationUrl;
        const buttonClass = style.btn;
        return (
            <a href={url} onClick={handleButtonClick} className={buttonClass}>
                {childElements}
            </a>
        );
    } else {
        const buttonClass = `${style.btn}  ${style.disabled}`;
        return <span className={buttonClass}>{childElements}</span>;
    }
};

ProductSpecificationButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ProductSpecificationButton;
