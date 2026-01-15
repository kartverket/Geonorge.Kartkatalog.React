// Dependencies
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { getResource } from "actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "reducers/TagManagerReducer";

// Stylesheets
import buttonStyle from "components/partials/Buttons/Buttons.module.scss";
import style from "components/partials/Buttons/ShowCoverageButton.module.scss";

const ShowCoverageButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        if (props.metadata.CoverageUrl) {
            // Calculate window size and position for centering
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
        const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "globe"]} key="icon" />;
        const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
        const childElements = [icon, textContent];

        if (props.metadata.CoverageUrl) {
            const buttonClass = buttonStyle.btn;
            return (
                <button className={buttonClass} onClick={handleButtonClick}>
                    {childElements}
                </button>
            );
        } else {
            const buttonClass = `${buttonStyle.btn}  ${buttonStyle.disabled}`;
            return (
                <button disabled className={buttonClass}>
                    {childElements}
                </button>
            );
        }
    };

    return (
        <Fragment>
            {renderButton()}
        </Fragment>
    );
};

ShowCoverageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ShowCoverageButton;
