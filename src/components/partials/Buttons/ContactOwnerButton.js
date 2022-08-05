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

const ContactOwnerButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };
        dispatch(
            pushToDataLayer({
                event: "contact",
                category: "metadataDetails",
                activity: "contactDataOwner",
                metadata: tagData
            })
        );
    };

    const buttonDescription = dispatch(getResource("ContactDataOwner", "Kontakt dataeier"));
    const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "envelope"]} key="icon" />;
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const childElements = [icon, textContent];

    if (props.metadata.ContactMetadata) {
        const email = props.metadata.ContactMetadata.Email;
        const buttonClass = style.btn;
        return (
            <a
                href={`mailto:${email}`}
                onClick={handleButtonClick}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass}
            >
                {childElements}
            </a>
        );
    } else {
        const buttonClass = `${style.btn}  ${style.disabled}`;
        return <span className={buttonClass}>{childElements}</span>;
    }
};

ContactOwnerButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ContactOwnerButton;
