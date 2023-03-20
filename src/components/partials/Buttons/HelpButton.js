// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { getResource } from "actions/ResourceActions";

// Stylesheets
import style from "components/partials/Buttons/Buttons.module.scss";

const HelpButton = (props) => {
    const dispatch = useDispatch();

    const buttonDescription = dispatch(getResource("Help", "Hjelp"));
    const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "question-circle"]} key="icon" />;
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const childElements = [icon, textContent];

    if (props.metadata.HelpUrl || props.metadata.SupplementalDescription) {
        const url = props.metadata.SupplementalDescription ? "#help-info" : props.metadata.HelpUrl;
        const buttonClass = style.btn;
        return React.createElement("a", { href: url, className: buttonClass }, childElements);
    } else {
        const buttonClass = `${style.btn}  ${style.disabled}`;
        return React.createElement("button", { className: buttonClass, disabled: true }, childElements);
    }
};

HelpButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default HelpButton;
