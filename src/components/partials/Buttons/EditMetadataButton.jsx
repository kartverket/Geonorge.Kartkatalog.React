// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@digdir/designsystemet-react";
// Actions
import { getResource } from "@/actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "@/reducers/TagManagerReducer";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons.module.scss";
import { PencilIcon } from '@navikt/aksel-icons';



const EditMetadataButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };
        dispatch(
            pushToDataLayer({
                event: "edit",
                category: "metadataDetails",
                activity: "editMetadata",
                metadata: tagData
            })
        );
    };

    const buttonDescription = `${dispatch(getResource("Edit", "Rediger"))} metadata`;
    const url = props.metadata.MetadataEditUrl;
    const metMetadata = props.metadata.MetMetadata;
    const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
    const buttonClass = `${style.detailButton} ${style.secondaryButton}`;

    if (url?.trim() && !metMetadata) {
        return (
            <Button asChild variant="primary" className={buttonClass}>
                <a href={url} onClick={handleButtonClick}>
                    <PencilIcon title="a11y-title" fontSize="1.5rem" />
                    <span className={style.buttonText}>{buttonDescription}</span>
                </a>
            </Button>
        );
    } else {
        return null;
    }
};

EditMetadataButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default EditMetadataButton;
