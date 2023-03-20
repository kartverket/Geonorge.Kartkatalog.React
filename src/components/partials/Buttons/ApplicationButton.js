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

const ApplicationButton = (props) => {
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
                activity: "showWebsite",
                metadata: tagData
            })
        );
    };

    const isApplication = () => {
        return props.metadata.Type === "software" || props.metadata.Type === "Applikasjon";
    };

    const buttonDescription = dispatch(getResource("WebPage", "Nettside"));

    if (props.listButton) {
        if (isApplication(props.metadata.Type)) {
            if (props.metadata.DistributionUrl || props.metadata.DownloadUrl) {
                let distributionUrl = props.metadata.DistributionUrl
                    ? props.metadata.DistributionUrl
                    : props.metadata.DownloadUrl;
                let icon = (
                    <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />
                );
                let buttonClass = `${style.listButton} ${style.ext}`;
                let textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
                let childElements = [icon, textContent];
                return (
                    <a
                        href={distributionUrl}
                        onClick={handleButtonClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass}
                    >
                        {childElements}
                    </a>
                );
            } else {
                let icon = (
                    <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />
                );
                let buttonClass = `btn btn-sm ${style.listButton} ${style.disabled} ${style.off}`;
                let textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
                let childElements = [icon, textContent];
                return (
                    <button disabled className={buttonClass}>
                        {childElements}
                    </button>
                );
            }
        }
        return null;
    } else {
        if (props.metadata.CanShowWebsiteUrl && props.metadata.DistributionUrl) {
            let url = props.metadata.DistributionUrl;
            let icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement("span", { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement("a", { href: url, className: buttonClass, target: "_blank" }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />;
            let buttonClass = `${style.btn}  ${style.disabled}`;
            let textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement("button", { className: buttonClass, disabled: true }, childElements);
        }
    }
};

ApplicationButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool
};

ApplicationButton.defaultProps = {
    listButton: true
};

export default ApplicationButton;
