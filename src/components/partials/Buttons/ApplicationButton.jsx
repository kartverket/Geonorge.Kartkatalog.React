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

    if (props.listButton) {
        if (isApplication(props.metadata.Type)) {
            if (props.metadata.DistributionUrl || props.metadata.DownloadUrl) {
                let distributionUrl = props.metadata.DistributionUrl
                    ? props.metadata.DistributionUrl
                    : props.metadata.DownloadUrl;

                let buttonClass = `${style.listButton} ${style.ext}`;
                //digdir designssystem knapp
                return (
                    <Button
                        asChild variant= "primary" className={buttonClass}
                        >
                        <a href={distributionUrl}
                        onClick={handleButtonClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                                        
                                    
                            {buttonDescription}
                        </a>
                                 
                                 
                    </Button>
                );
            } else {
                let buttonClass = `btn btn-sm ${style.listButton} ${style.disabled} ${style.off}`;
                return (
                    <Button  
                    variant="secondary" 
                    className={buttonClass}
                    disabled
                    >
                        {buttonDescription}

                    </Button>

                );
            }
        }
        return null;
    } else {
        if (props.metadata.CanShowWebsiteUrl && props.metadata.DistributionUrl) {
            let url = props.metadata.DistributionUrl;
            //nettside lenke inn til listitem
            let icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement("span", { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement("a", { href: url, className: buttonClass, target: "_blank" }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />;
            let buttonClass = `${style.btn}  ${style.disabled}`;
            let textContent = React.createElement("span", { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement("button", { className: buttonClass, disabled: true }, childElements);
        }
    }
};

ApplicationButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool
};

ApplicationButton.defaultProps = {
    listButton: true
};

export default ApplicationButton;
