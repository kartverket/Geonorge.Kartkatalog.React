// Dependencies
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Button } from "@digdir/designsystemet-react";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "@/reducers/TagManagerReducer";

// Stylesheets
import buttonStyle from "@/components/partials/Buttons/Buttons2.module.scss";

const ShowCoverageButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        if (props.metadata.CoverageUrl) {
            const windowWidth = 1400;
            const windowHeight = 900;
            const left = (window.screen.width - windowWidth) / 2;
            const top = (window.screen.height - windowHeight) / 2;

            window.open(
                props.metadata.CoverageUrl,
                "dekningskart",
                `width=${windowWidth},height=${windowHeight},left=${left},top=${top},scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no`
            );

            const tagData = {
                name: props.metadata.Title,
                uuid: props.metadata.Uuid
            };

            dispatch(
                pushToDataLayer({
                    event: "showMore",
                    category: "metadataDetails",
                    activity: "showCoverageMap",
                    metadata: tagData
                })
            );
        }
    };

    const renderButton = () => {
        const buttonDescription = dispatch(getResource("DisplayCoverageMap", "Vis dekningskart"));

        if (!props.metadata.CoverageUrl?.trim()) return null;

        return (
            <Button variant="primary" className={buttonStyle.detailButton} onClick={handleButtonClick}>
                <span className={buttonStyle.buttonText}>{buttonDescription}</span>
            </Button>
        );
    };

    return renderButton();
};

ShowCoverageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ShowCoverageButton;