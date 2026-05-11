// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePostHog } from "@posthog/react";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "@/reducers/TagManagerReducer";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons.module.scss";
import { Button } from "@digdir/designsystemet-react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";


const ApplicationButton = (props) => {
    const dispatch = useDispatch();
    const posthog = usePostHog();

    const handleButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };

        dispatch(
            pushToDataLayer({
                event: "showMore",
                category: "metadataDetails",
                activity: "showWebsite",
                metadata: tagData
            })
        );

        posthog?.capture("application_link_clicked", {
            title: props.metadata.Title,
            uuid: props.metadata.Uuid,
            distribution_url: props.metadata.DistributionUrl || props.metadata.DownloadUrl,
            organization: props.metadata.Organization,
        });
    };

    const isApplication = () => {
        return props.metadata.Type === "software" || props.metadata.Type === "Applikasjon";
    };

    const buttonDescription = dispatch(getResource("WebPage", "Nettside"));
    const distributionUrl = props.metadata.DistributionUrl || props.metadata.DownloadUrl;

    const shouldRender = props.listButton
        ? isApplication() && distributionUrl
        : props.metadata.CanShowWebsiteUrl && distributionUrl;

    if (!shouldRender) return null;

    const buttonClass = props.listButton
        ? `${style.listButton} ${style.ext}`
        : `${style.detailButton} ${style.primaryButton}`;

    return (
        <Button asChild variant="primary" className={buttonClass}>
            <a
                href={distributionUrl}
                onClick={handleButtonClick}
                target="_blank"
                rel="noopener noreferrer"
            >
                <ExternalLinkIcon aria-hidden="true" fontSize="1.5rem" />
                <span className={style.buttonText}>{buttonDescription}</span>
            </a>
        </Button>
    );
};

ApplicationButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool
};

ApplicationButton.defaultProps = {
    listButton: true
};

export default ApplicationButton;
