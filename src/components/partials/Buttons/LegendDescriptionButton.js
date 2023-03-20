// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { getResource } from "actions/ResourceActions";

// Stylesheets
import style from "components/partials/Buttons/Buttons.module.scss";

const LegendDescriptionButton = (props) => {
    const dispatch = useDispatch();

    const buttonDescription = dispatch(getResource("DisplayCartography", "Vis tegneregler"));
    const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "image"]} key="icon" />;
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const childElements = [icon, textContent];

    if (props.metadata.LegendDescriptionUrl) {
        let url = props.metadata.LegendDescriptionUrl;
        let buttonClass = style.btn;
        return React.createElement("a", { href: url, className: buttonClass }, childElements);
    } else {
        let buttonClass = `${style.btn}  ${style.disabled}`;
        return React.createElement("button", { className: buttonClass, disabled: true }, childElements);
    }
};

LegendDescriptionButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default LegendDescriptionButton;
