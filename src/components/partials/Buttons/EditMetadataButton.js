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

const EditMetadataButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };
        dispatch(
            pushToDataLayer({
                event: "edit",
                category: "metadataDetails",
                activity: "editMetadata",
                metadata: tagData
            })
        );
    };

    const buttonDescription = `${dispatch(getResource("Edit", "Rediger"))} metadata`;
    const url = props.metadata.MetadataEditUrl;
    const metMetadata = props.metadata.MetMetadata;
    const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "edit"]} key="icon" />;
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const childElements = [icon, textContent];

    if (url && !metMetadata) {
        let buttonClass = style.btn;
        return (
            <a href={url} onClick={handleButtonClick} className={buttonClass}>
                {childElements}
            </a>
        );
    } else {
        let buttonClass = `${style.btn}  ${style.disabled}`;
        return (
            <button disabled className={buttonClass}>
                {childElements}
            </button>
        );
    }
};

EditMetadataButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default EditMetadataButton;
