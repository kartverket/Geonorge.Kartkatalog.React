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

const ProductSheetButton = (props) => {
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
                activity: "showProductSheet",
                metadata: tagData
            })
        );
    };

    const buttonDescription = dispatch(getResource("DisplayProductSheet", "Vis produktark"));
    const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "info-circle"]} key="icon" />;
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const childElements = [icon, textContent];
    if (props.metadata.ProductSheetUrl) {
        const url = props.metadata.ProductSheetUrl;
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

ProductSheetButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ProductSheetButton;
