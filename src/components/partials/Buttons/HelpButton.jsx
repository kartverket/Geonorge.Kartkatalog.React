// Dependencies

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { Button } from "@digdir/designsystemet-react";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons2.module.scss";

const HelpButton = (props) => {
    const dispatch = useDispatch();

    const buttonDescription = dispatch(getResource("Help", "Hjelp"));
    const url = props.metadata.SupplementalDescription
        ? "#help-info"
        : props.metadata.HelpUrl;

    if (!url) return null;

    return (
        <Button asChild variant="primary" className={style.detailButton}>
            <a href={url}>
                <span className={style.buttonText}>{buttonDescription}</span>
            </a>
        </Button>
    );
};

HelpButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default HelpButton;
