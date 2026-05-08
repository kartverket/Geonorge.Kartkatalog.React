// Dependencies

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { Button } from "@digdir/designsystemet-react";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons.module.scss";
import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';



const HelpButton = (props) => {
    const dispatch = useDispatch();

    const buttonDescription = dispatch(getResource("Help", "Hjelp"));
    const url = props.metadata.SupplementalDescription
        ? "#help-info"
        : props.metadata.HelpUrl;

    const buttonClass = `${style.detailButton} ${style.secondaryButton}`;
    if (!url) return null;

    return (
        <Button asChild variant="secondary" className={buttonClass}>
            <a href={url}>
                <QuestionmarkCircleIcon title={buttonDescription} fontSize="1.5rem" />
                <span className={style.buttonText}>{buttonDescription}</span>
            </a>
        </Button>
    );
};

HelpButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default HelpButton;
