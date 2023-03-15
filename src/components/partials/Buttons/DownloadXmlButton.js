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

const DownloadXmlButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };
        dispatch(
            pushToDataLayer({
                event: "download",
                category: "metadataDetails",
                activity: "downloadXML",
                metadata: tagData
            })
        );
    };

    const buttonDescription = `${dispatch(getResource("Download", "Last ned"))} metadata XML`;
    const url = props.metadata.MetadataXmlUrl;
    const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "file-code"]} key="icon" />;
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const childElements = [icon, textContent];

    if (url?.length) {
        const buttonClass = style.btn;
        return (
            <a href={url} onClick={handleButtonClick} className={buttonClass}>
                {childElements}
            </a>
        );
    } else {
        const buttonClass = `${style.btn}  ${style.disabled}`;
        return (
            <button disabled className={buttonClass}>
                {childElements}
            </button>
        );
    }
};

DownloadXmlButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default DownloadXmlButton;
