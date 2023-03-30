// Dependencies
import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Geonorge Webcomponents
import { GnDialog } from "@kartverket/geonorge-web-components";

// Actions
import { getResource } from "actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "reducers/TagManagerReducer";

// Stylesheets
import buttonStyle from "components/partials/Buttons/Buttons.module.scss";
import style from "components/partials/Buttons/ShowCoverageButton.module.scss";

const ShowCoverageButton = (props) => {
    const dispatch = useDispatch();

    // State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const handleButtonClick = () => {
        openDialog();
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

    const renderDialog = () => {
        return props.metadata.CoverageUrl && isMounted ? (
            <gn-dialog width="1000px" nopadding="true" show={dialogOpen} overflow="hidden">
                <iframe
                    className={style.coverageMap}
                    src={props.metadata.CoverageUrl}
                    title="Coverage map"
                    width="1000px"
                    height="720px"
                />
            </gn-dialog>
        ) : null;
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

    const openDialog = () => {
        setDialogOpen(false);
        setTimeout(() => {
            setDialogOpen(true);
        });
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Fragment>
            {renderDialog()}
            {renderButton()}
        </Fragment>
    );
};

ShowCoverageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ShowCoverageButton;
