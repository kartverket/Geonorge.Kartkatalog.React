// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Button } from "@digdir/designsystemet-react";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons2.module.scss";
import { ExternalLinkIcon } from '@navikt/aksel-icons';

const LegendDescriptionButton = (props) => {
    const dispatch = useDispatch();

    const buttonDescription = dispatch(getResource("DisplayCartography", "Vis tegneregler"));
    const url = props.metadata.LegendDescriptionUrl;

    if (!url?.trim()) return null;
    
    const buttonClass = `${style.detailButton} ${style.primaryButton}`;
    return (
        <Button asChild variant="primary" className={buttonClass}>
            <a href={url}>
                <ExternalLinkIcon aria-hidden="true" />
                <span className={style.buttonText}>
                    {buttonDescription}
                </span>
            </a>
        </Button>
    );
};

LegendDescriptionButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default LegendDescriptionButton;