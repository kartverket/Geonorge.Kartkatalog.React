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
import style from "@/components/partials/Buttons/Buttons2.module.scss";



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

    if (url?.trim() && !metMetadata) {
        return (
            <Button asChild variant="primary" className={style.detailButton}>
                <a href={url} onClick={handleButtonClick}>
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
