// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { getResource } from "actions/ResourceActions";

// Stylesheets
import style from "components/partials/Buttons/Buttons.module.scss";

const ProductPageButton = (props) => {
    const dispatch = useDispatch();

    const formatProductPageUrl = (url) => {
        let newUrl = window.decodeURIComponent(url);
        newUrl = newUrl.trim().replace(/\s/g, "");

        if (/^(:\/\/)/.test(newUrl)) {
            return `https${newUrl}`;
        }
        if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
            return `https://${newUrl}`;
        }
        return url;
    };

    const buttonDescription = dispatch(getResource("DisplayProductPage", "Vis produktside"));
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />;
    const childElements = [icon, textContent];

    if (props.metadata.ProductPageUrl) {
        const url = formatProductPageUrl(props.metadata.ProductPageUrl);
        const buttonClass = style.btn;
        return React.createElement("a", { href: url, className: buttonClass }, childElements);
    } else {
        const buttonClass = `${style.btn}  ${style.disabled}`;
        return React.createElement("button", { className: buttonClass, disabled: true }, childElements);
    }
};

ProductPageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ProductPageButton;
