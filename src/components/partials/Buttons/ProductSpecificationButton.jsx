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
import style from "@/components/partials/Buttons/Buttons2.module.scss";

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

    if (!url?.trim()) return null;

    return (
        <Button asChild variant="primary" className={style.detailButton}>
            <a href={url} onClick={handleButtonClick}>
                <span className={style.buttonText}>{buttonDescription}</span>
            </a>
        </Button>
    );
};

ProductSpecificationButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ProductSpecificationButton;