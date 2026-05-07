// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Button } from "@digdir/designsystemet-react";


// Actions
import { getResource } from "@/actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "@/reducers/TagManagerReducer";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons.module.scss";
import { ExternalLinkIcon } from '@navikt/aksel-icons';

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
    const url = props.metadata.ProductSpecificationUrl;
    const buttonClass = `${style.detailButton} ${style.primaryButton}`;

    if (!url?.trim()) return null;

    return (
        <Button asChild variant="primary" className={buttonClass}>
            <a href={url} onClick={handleButtonClick}>
                <ExternalLinkIcon aria-hidden="true" />
                <span className={style.buttonText}>{buttonDescription}</span>
            </a>
        </Button>
    );
};

ProductSpecificationButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ProductSpecificationButton;