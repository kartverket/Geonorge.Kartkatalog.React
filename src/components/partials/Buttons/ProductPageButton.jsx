// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Button } from "@digdir/designsystemet-react";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons.module.scss";
import { ExternalLinkIcon } from '@navikt/aksel-icons';
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
    const rawUrl = props.metadata.ProductPageUrl;
    const buttonClass = `${style.detailButton} ${style.primaryButton}`;

    if (!rawUrl?.trim()) return null;

    const url = formatProductPageUrl(rawUrl);

    return (
        <Button asChild variant="primary" className={buttonClass}>
            <a href={url}>
                <ExternalLinkIcon aria-hidden="true" />
                <span className={style.buttonText}>{buttonDescription}</span>
            </a>
        </Button>
    );
};

ProductPageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ProductPageButton;