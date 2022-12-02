// Dependencies
import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import Modal from "components/partials/Buttons/Modal.js";

// Actions
import { getResource } from "actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "reducers/TagManagerReducer";

// Stylesheets
import style from "components/partials/Buttons/Buttons.module.scss";

const ShowCoverageButton = (props) => {
    const dispatch = useDispatch();

    // State
    const [showModal, setShowModal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true);
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
    };

    const renderModal = () => {
        return props.metadata.CoverageUrl && isMounted ? (
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <iframe
                    src={showModal ? props.metadata.CoverageUrl : ""}
                    title="Coverage map"
                    width="100%"
                    height="800px"
                />
            </Modal>
        ) : null;
    };

    const renderButton = () => {
        const buttonDescription = dispatch(getResource("DisplayCoverageMap", "Vis dekningskart"));
        const icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "globe"]} key="icon" />;
        const textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
        const childElements = [icon, textContent];

        if (props.metadata.CoverageUrl) {
            const buttonClass = style.btn;
            return (
                <span className={buttonClass} onClick={handleButtonClick}>
                    {childElements}
                </span>
            );
        } else {
            const buttonClass = `${style.btn}  ${style.disabled}`;
            return <span className={buttonClass}>{childElements}</span>;
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Fragment>
            {renderModal()}
            {renderButton()}
        </Fragment>
    );
};

ShowCoverageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ShowCoverageButton;
